function generate_calendar() {
    var file = document.getElementById('inputFile').files[0]
    if (!file) {
        M.toast({html: '请先选择文件', classes: 'deep-orange lighten-1'})
        console.error('No file selected.')
        return
    }
    var reader = new FileReader()
    reader.readAsText(file, 'UTF-8')
    reader.onload = function (e) {
        var corpus = {}
        var content = e.target.result
        content.split('\n').slice(1).forEach(line => {
            if (line) {
                var columns = line.split('","').slice(-2)
                var name = columns[0]
                var text = columns[1].slice(0, -2)
                corpus[name] = text
            }
        })
        console.log(corpus)

        var select = document.getElementById('inputYear')
        var year = select.value

        var xhr = new XMLHttpRequest()
        xhr.open('POST', '/api/service/?year=' + year.toString(), true)
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
        xhr.send(JSON.stringify(corpus))
    }
    reader.onerror = function (e) {
        M.toast({html: '读取文件错误', classes: 'deep-orange lighten-1'})
        console.error('Failed to read file.')
    }
}
