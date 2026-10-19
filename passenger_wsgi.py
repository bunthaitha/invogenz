import sys
import os
import traceback

# Ensure the application directory is at the top of sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

try:
    from app import app as application
except Exception as e:
    error_details = traceback.format_exc()
    # Write to passenger.log for debugging
    log_path = os.path.join(current_dir, "passenger_startup_error.log")
    try:
        with open(log_path, "a", encoding="utf-8") as f:
            f.write(error_details + "\n" + "="*50 + "\n")
    except Exception:
        pass

    # Fallback WSGI application to display the exact startup issue directly in browser
    def application(environ, start_response):
        status = '500 Internal Server Error'
        html = f"""<!DOCTYPE html>
<html>
<head>
    <title>Invogenz • Python Startup Diagnostic</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0b1120; color: #f8fafc; padding: 2rem; margin: 0; }}
        .card {{ max-width: 800px; margin: 2rem auto; background: #131b2e; border: 1px solid #232f48; border-radius: 12px; padding: 2rem; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }}
        h1 {{ color: #ef4444; font-size: 1.4rem; margin-top: 0; }}
        pre {{ background: #090d16; color: #38bdf8; padding: 1.25rem; border-radius: 8px; overflow-x: auto; font-family: monospace; font-size: 0.85rem; line-height: 1.5; border: 1px solid #1e293b; }}
        .steps {{ background: rgba(79, 70, 229, 0.1); border-left: 4px solid #6366f1; padding: 1rem 1.25rem; margin-top: 1.5rem; border-radius: 4px; }}
        ol {{ margin: 0; padding-left: 1.2rem; }}
        li {{ margin-bottom: 0.5rem; }}
        code {{ background: #1e293b; color: #f8fafc; padding: 0.2rem 0.4rem; border-radius: 4px; font-family: monospace; font-size: 0.85rem; }}
    </style>
</head>
<body>
    <div class="card">
        <h1>⚠️ Invogenz Python Startup Diagnostic</h1>
        <p>Phusion Passenger successfully invoked Python, but encountered an import error (usually a missing dependency like <code>flask</code>):</p>
        <pre>{error_details}</pre>
        <div class="steps">
            <strong>How to resolve:</strong>
            <ol>
                <li>In cPanel, go to <strong>Setup Python App</strong>.</li>
                <li>Under <strong>Configuration files</strong>, enter <code>requirements.txt</code> and click <strong>Add</strong>.</li>
                <li>Click <strong>Run Pip Install</strong>.</li>
                <li>Click <strong>Restart</strong>.</li>
            </ol>
        </div>
    </div>
</body>
</html>"""
        encoded = html.encode('utf-8')
        response_headers = [
            ('Content-Type', 'text/html; charset=utf-8'),
            ('Content-Length', str(len(encoded)))
        ]
        start_response(status, response_headers)
        return [encoded]

if __name__ == "__main__":
    application.run()
