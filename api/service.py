import json
import cgi
from urllib.parse import parse_qs
from http.server import HTTPServer, BaseHTTPRequestHandler
from core.inspirepdf import InspirePDF

filename = 'kindle_canlendar.pdf'

class Handler(BaseHTTPRequestHandler):
    def _refuse_request(self):
        self.send_response(400)
        self.end_headers()

    def _success_response(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/pdf')
        self.send_header('Content-Disposition', f'inline; filename={filename}')
        self.send_header('Content-Transfer-Encoding', 'binary')
        self.send_header('Accept-Ranges', 'bytes')
        self.end_headers()

    def do_POST(self):
        # check input request
        #  ctype, _ = cgi.parse_header(self.headers.getheader('content-type'))
        ctype, _ = cgi.parse_header(self.headers.get('content-type'))
        if ctype != 'application/json':
            return self._refuse_request()

        pdf = InspirePDF(format='A4')

        # read the parameter 'year'
        params = parse_qs(self.path[2:])
        if 'year' in params.keys():
            pdf.set_year(int(params['year'][0]))

        # read the message and convert it into a python dictionary
        length = int(self.headers.getheader('content-length'))
        corpus = json.loads(self.rfile.read(length))
        pdf.set_corpus(corpus)

        # generate target file
        pdf.generate_calendar()
        pdf.output(filename, 'F')

        # response
        self._success_response()
        with open(filename, 'rb') as f:
            self.wfile.write(f.read())
        return

def run():
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, Handler)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()

if __name__ == "__main__":
    run()
