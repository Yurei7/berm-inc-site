#!/usr/bin/env python3
"""Local static server for verifying the built site/ directory.

Usage:  python3 dev/serve.py [port]     (default 8900)
Serves ./site — run `npm run build` first.
"""
import http.server
import os
import socketserver
import sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'site')
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8900


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def log_message(self, fmt, *args):
        pass


if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(('127.0.0.1', PORT), Handler) as httpd:
        print(f'serving {os.path.realpath(ROOT)} on http://127.0.0.1:{PORT}')
        httpd.serve_forever()
