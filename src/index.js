import fs from 'fs'
import path from 'path'
import ReactDOM from 'react-dom';
import { ChakraProvider, Container, Heading, Checkbox, Wrap, WrapItem, Button, Flex, Spacer } from '@chakra-ui/react'
import hitokoto from './hitokoto.js'
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

  const yearHitokoto = get_hitokoto_sentences()

  const year = new Date().getFullYear()
  const daysOfMonth = [
    31, year % 4 == 0 ? 29 : 28, 31, 30,
    31, 30, 31, 31, 30, 31, 30, 31]

  let counter = 0
  for (let month = 1; month <= 12; month++) {
    for (let day = 1; day <= daysOfMonth[month - 1]; day++) {
      doc.moveTo(0, 0)

      doc.lineWidth(5)
        .lineJoin('round')
        .rect(40, 40, 595 - 80, 842 - 80)
        .stroke()
      doc.lineWidth(3)
        .rect(50, 50, 595 - 100, 842 - 100)
        .stroke()

      doc.font('SimHei')
        .fontSize(60)
        .moveDown()
        .text(`${year} 年 ${month} 月`, {align: 'center'})

      doc.font('SimHei')
        .fontSize(100)
        .moveDown()
        .text(`${day}`, {align: 'center'})

      const htkt = yearHitokoto[counter++]
      const from = htkt['from_who'] || htkt['from'] || 'unknown'
      const content = (htkt['hitokoto'] || 'Nothing').slice(0, 85)

      doc.font('SimHei')
        .fontSize(30)
        .moveDown(2)
        .text(`@${from}`)
        .moveDown(0.5)
        .text(`${content}`)

      if (month != 12 || day <=30) doc.addPage()
    }
  }

  doc.end()
  stream.on('finish', () => {
    const blob = stream.toBlob('application/pdf')
    const url = stream.toBlobURL('application/pdf')
    const iframe = document.querySelector('iframe')
    iframe.src = url
  })
}


function get_hitokoto_sentences() {
  const daysOfYear = new Date().getFullYear() % 4 == 0 ? 366 : 365
  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  const checkedValues =
    Array.from(document.querySelectorAll('input[type=checkbox]:checked'))
    .map((box) => box.value)

  const yearHitokoto = []
  while (yearHitokoto.length < daysOfYear) {
    let category = checkedValues[getRandomInt(0, checkedValues.length - 1)]
    let item = hitokoto[category][getRandomInt(0, hitokoto[category].length - 1)]
    yearHitokoto.push(item)
  }

  return yearHitokoto
}


export function App() {
  const categories = [
    '动画', '漫画', '游戏', '文学', '原创', '来自网络',
    '其他', '影视', '诗词', '网易云', '哲学', '抖机灵'
  ]
  return (
    <ChakraProvider>
      <Container>
        <Heading mt={5} mb={5}>Kindle Calendar Generator</Heading>
        <Wrap spacing='10px' mb={5}>
          {categories.map((item, index) => {
            return (
              <WrapItem>
                <Checkbox defaultChecked name={'cb' + index}
                    value={String.fromCharCode(97 + index)}>
                  {item}
                </Checkbox>
              </WrapItem>
            )
          })}
        </Wrap>
        <Flex mb={5}>
          <Spacer />
          <Button colorScheme='teal' onClick={generate_calendar}>生成</Button>
        </Flex>
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
