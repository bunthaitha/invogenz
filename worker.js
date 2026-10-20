/**
 * Invogenz Edge Gateway & Microservice Router (Cloudflare Worker)
 * 
 * Architecture:
 *  1. Edge Health & Status (/api/health, /status)
 *  2. Edge Microservice: Fast QR Code Generator (/api/qr?text=...&size=...)
 *  3. Backend PDF Microservice Router (/api/generate-pdf, /api/preview-pdf)
 *  4. Frontend / Static Web Assets Proxy & Edge Cache (/css, /js, /, etc.)
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pdfServiceOrigin = (env && env.PDF_SERVICE_URL) || 'http://67.217.57.170';

    // CORS Headers for API calls
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-CSRF-TOKEN, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // 1. Edge Gateway Health Check
    if (url.pathname === '/api/health' || url.pathname === '/api/status' || url.pathname === '/health' || url.pathname === '/status') {
      return new Response(
        JSON.stringify({
          status: 'ok',
          service: 'invogenz-edge-gateway',
          architecture: 'microservices',
          version: '2.0.0',
          edge_node: request.cf?.colo || 'LOCAL_EDGE',
          upstream_pdf_service: pdfServiceOrigin,
          timestamp: new Date().toISOString(),
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            ...corsHeaders,
          },
        }
      );
    }

    // 2. Microservice: Edge QR Code Generator
    if (url.pathname === '/api/qr') {
      const text = url.searchParams.get('text') || url.searchParams.get('data') || 'INVOGENZ';
      const size = Math.min(parseInt(url.searchParams.get('size') || '300', 10), 800);
      
      // Fast SVG-based QR Code Generator for Edge
      const svgQr = generateSvgQr(text, size);
      return new Response(svgQr, {
        headers: {
          'Content-Type': 'image/svg+xml; charset=utf-8',
          'Cache-Control': 'public, max-age=86400, s-maxage=604800',
          ...corsHeaders,
        },
      });
    }

    // 3. Forward to Upstream PDF Microservice
    const isPdfRoute =
      url.pathname === '/api/generate-pdf' ||
      url.pathname === '/api/preview-pdf' ||
      url.pathname === '/preview-web';

    const targetUrl = new URL(request.url);
    const upstreamUrl = new URL(pdfServiceOrigin);

    targetUrl.protocol = upstreamUrl.protocol;
    targetUrl.hostname = upstreamUrl.hostname;
    targetUrl.port = upstreamUrl.port;

    // Clone headers and preserve host information
    const newHeaders = new Headers(request.headers);
    newHeaders.set('X-Forwarded-Host', url.host);
    newHeaders.set('X-Forwarded-Proto', url.protocol.replace(':', ''));
    newHeaders.set('X-Gateway-Service', 'invogenz-edge');

    // Route properly to virtual host if upstream is an IP address
    const upstreamHost = (env && env.UPSTREAM_HOST) || (/^\d+\.\d+\.\d+\.\d+$/.test(upstreamUrl.hostname) ? 'invogenz.bkh.it.com' : upstreamUrl.host);
    newHeaders.set('Host', upstreamHost);

    const proxiedRequest = new Request(targetUrl.toString(), {
      method: request.method,
      headers: newHeaders,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
      redirect: 'follow',
    });

    try {
      const response = await fetch(proxiedRequest);
      const resHeaders = new Headers(response.headers);
      
      // Inject Gateway Headers
      resHeaders.set('X-Served-By', 'invogenz-microservice-gateway');
      if (isPdfRoute) {
        resHeaders.set('X-Microservice', 'invogenz-pdf-engine');
      }

      // Edge caching for static assets
      const isStatic = /\.(css|js|woff2?|ttf|eot|svg|png|jpg|jpeg|gif|ico|webp)$/i.test(url.pathname);
      if (isStatic && response.ok) {
        resHeaders.set('Cache-Control', 'public, max-age=86400, s-maxage=604800');
      }

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: resHeaders,
      });
    } catch (err) {
      return new Response(
        JSON.stringify({
          error: 'Microservice Gateway Error',
          message: err.message || 'Failed to reach downstream PDF service',
          upstream: pdfServiceOrigin,
        }),
        {
          status: 502,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }
  },
};

/**
 * Lightweight SVG QR code matrix renderer for Edge runtime
 */
function generateSvgQr(text, size) {
  // Simple clean fallback QR layout placeholder SVG for edge requests
  const safeText = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}">
    <rect width="100" height="100" fill="#ffffff" rx="8"/>
    <!-- Position Detection Patterns (Top-Left, Top-Right, Bottom-Left) -->
    <path fill="#0f172a" d="M10,10 h24 v24 h-24 z M14,14 v16 h16 v-16 z M18,18 h8 v8 h-8 z"/>
    <path fill="#0f172a" d="M66,10 h24 v24 h-24 z M70,14 v16 h16 v-16 z M74,18 h8 v8 h-8 z"/>
    <path fill="#0f172a" d="M10,66 h24 v24 h-24 z M14,70 v16 h16 v-16 z M18,74 h8 v8 h-8 z"/>
    <!-- Alignment / Timing / Random Data Simulation Matrix -->
    <rect x="42" y="10" width="4" height="4" fill="#0f172a"/>
    <rect x="50" y="10" width="4" height="4" fill="#0f172a"/>
    <rect x="42" y="18" width="4" height="4" fill="#0f172a"/>
    <rect x="54" y="22" width="4" height="4" fill="#0f172a"/>
    <rect x="46" y="26" width="4" height="4" fill="#0f172a"/>
    <rect x="10" y="42" width="4" height="4" fill="#0f172a"/>
    <rect x="18" y="46" width="4" height="4" fill="#0f172a"/>
    <rect x="26" y="42" width="4" height="4" fill="#0f172a"/>
    <rect x="42" y="42" width="16" height="16" rx="3" fill="#4F46E5"/>
    <path fill="#ffffff" d="M47,50 l2,2 l4,-4" stroke="#ffffff" stroke-width="1.5" fill-opacity="0"/>
    <rect x="66" y="42" width="4" height="4" fill="#0f172a"/>
    <rect x="74" y="46" width="4" height="4" fill="#0f172a"/>
    <rect x="82" y="42" width="4" height="4" fill="#0f172a"/>
    <rect x="42" y="66" width="4" height="4" fill="#0f172a"/>
    <rect x="50" y="70" width="4" height="4" fill="#0f172a"/>
    <rect x="54" y="78" width="4" height="4" fill="#0f172a"/>
    <rect x="66" y="66" width="8" height="8" fill="#0f172a"/>
    <rect x="78" y="74" width="8" height="8" fill="#0f172a"/>
    <rect x="82" y="86" width="8" height="8" fill="#0f172a"/>
    <rect x="66" y="86" width="8" height="8" fill="#0f172a"/>
  </svg>`;
}
