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
        e.preventDefault()
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
        xhr.onload = function(e) {
            if (this.status == 200) {
                var blob = new Blob([this.response], {type: 'application/pdf'})
                var dispo = e.currentTarget.getResponseHeader('Content-Disposition')
                var fileName = dispo.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)[1]
                console.log(fileName)
                var a = document.createElement('a')
                a.style = 'display: none'
                document.body.appendChild(a)
                var url = window.URL.createObjectURL(blob);
                a.href = url
                a.download = fileName
                a.click()
                window.URL.revokeObjectURL(url)
            }
        }

        xhr.open('POST', '/api/service/?year=' + year.toString(), true)
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
        xhr.responseType = 'blob'
        xhr.send(JSON.stringify(corpus))
    }
    reader.onerror = function (e) {
        M.toast({html: '读取文件错误', classes: 'deep-orange lighten-1'})
        console.error('Failed to read file.')
    }
}
