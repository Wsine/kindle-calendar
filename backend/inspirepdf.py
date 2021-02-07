import csv
import random
import calendar
from datetime import datetime
from fpdf import FPDF

class InspirePDF(FPDF):
    def __init__(self, *args, **kwargs):
        super(InspirePDF, self).__init__(*args, **kwargs)
        self.add_font('simhei', '', 'fonts/simhei.ttf', True)
        self.year = None

    def set_year(self, year):
        self.year = year

    def draw_frame(self):
        outer_edge, inner_edge = 8.0, 13.0
        self.set_line_width(2.0)
        self.rect(outer_edge, outer_edge, self.fw - 2 * outer_edge, self.fh - 2 * outer_edge)
        self.set_line_width(1.5)
        self.rect(inner_edge, inner_edge, self.fw - 2 * inner_edge, self.fh - 2 * inner_edge)

    def draw_date(self, date):
        year, month, day = date
        self.set_font('simhei', '', 70)
        left_margin = 25 if month >= 10 else 32
        self.text(left_margin, 70, f'{year} 年 {month} 月') # 25 / 32
        self.set_font('simhei', '', 150)
        left_margin = 80 if day >= 10 else 90
        self.text(left_margin, 150, f'{day}')

    def draw_chicken_soup(self, record):
        name, text = record
        self.set_font('simhei', '', 30)
        self.text(23, 200, f'@{name}')
        for i, pos in enumerate(range(0, len(text), 15)):
            subtext = text[pos : pos+15]
            self.text(23, 215 + i * 15, subtext)

    def set_corpus_file(self, corpus_file):
        with open(corpus_file) as csvfile:
            reader = csv.reader(csvfile, delimiter=',')
            next(reader, None)  # skip the headers
            self.corpus = [(row[-3], row[-2]) for row in reader]
        random.shuffle(self.corpus)

    def set_corpus(self, corpus):
        self.corpus = [(k, v) for k, v in corpus.items()]
        random.shuffle(self.corpus)

    def generate_calendar(self):
        year = self.year or datetime.now().year
        dates = [(year, month, day) \
                    for month in range(1, 12 + 1) \
                    for day in range(1, calendar.monthrange(year, month)[1] + 1)]

        if len(self.corpus) < len(dates):
            delta = len(dates) - len(self.corpus)
            selected = random.sample(range(len(self.corpus)), delta)
            self.corpus.extend([self.corpus[i] for i in selected])
        elif len(self.corpus) > len(dates):
            self.corpus = self.corpus[:len(dates)]
        assert(len(self.corpus) == len(dates))

        for date, record in zip(dates, self.corpus):
            self.add_page()
            self.draw_frame()
            self.draw_date(date)
            self.draw_chicken_soup(record)

def test():
    corpus_file = 'questionaire.csv'
    pdf = InspirePDF(format='A4')
    pdf.set_corpus_file(corpus_file)
    pdf.generate_calendar()
    pdf.output('kindle_canlendar.pdf', 'F')

if __name__ == '__main__':
    test()
