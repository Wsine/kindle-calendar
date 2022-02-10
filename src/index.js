import fs from 'fs'
import path from 'path'
import ReactDOM from 'react-dom';
import { ChakraProvider, Container, Heading } from '@chakra-ui/react'
const PDFDocument = require('pdfkit').default
const blobStream = require('blob-stream')
const simheiFont = fs.readFileSync(path.join(__dirname, '../fonts/simhei.ttf'))

async function generate_calendar() {
  // rounded off to 595 x 842 points(pt)
  const doc = new PDFDocument({
    size: 'A4'
  })
  doc.registerFont('SimHei', simheiFont)
  const stream = doc.pipe(blobStream())

  doc.lineWidth(5)
    .lineJoin('round')
    .rect(40, 40, 595 - 80, 842 - 80)
    .stroke()
  doc.lineWidth(3)
    .rect(50, 50, 595 - 100, 842 - 100)
    .stroke()

  doc.moveDown(8)
  doc.font('SimHei')
    .fontSize(60)
    .text('2021 年 1 月', {align: 'center'})

  doc.moveDown()
  doc.font('SimHei')
    .fontSize(100)
    .text('29', {align: 'center'})

  doc.fontSize(80).moveDown()
  doc.font('SimHei')
    .fontSize(30)
    .text('@正弦定理')
    .moveDown(0.5)
    .text('怕什么真理无穷，进一寸有一寸的欢喜。')

  doc.end()
  stream.on('finish', () => {
    const blob = stream.toBlob('application/pdf')
    const url = stream.toBlobURL('application/pdf')
    const iframe = document.querySelector('iframe')
    iframe.src = url
  })
}

export function App() {
  return (
    <ChakraProvider>
      <Container>
        <Heading mt={5} mb={5}>Kindle Calendar Generator</Heading>
        <iframe style={{
          border: '1px solid black',
          width: '100%',
          height: '70vh'
        }} />
      </Container>
    </ChakraProvider>
  )
}

const app = document.getElementById('app');
ReactDOM.render(<App />, app);

generate_calendar()
