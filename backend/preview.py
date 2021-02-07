from http.server import HTTPServer, BaseHTTPRequestHandler

file = 'kindle_canlendar.pdf'

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/pdf')
        self.send_header('Content-Disposition', f'inline; filename={file}')
        self.send_header('Content-Transfer-Encoding', 'binary')
        self.send_header('Accept-Ranges', 'bytes')
        self.end_headers()
        with open(file, 'rb') as f:
            self.wfile.write(f.read())
        return

def run():
    server_address = ('', 8080)
    httpd = HTTPServer(server_address, Handler)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()

if __name__ == "__main__":
    run()
