# Kindle-Calendar

该小项目是面向2020年封闭的Covid-19疫情下的如何获取积极的生活能量而创立。同时也是拯救吃灰的Kindle设备的一个积极思考。

## How to use

[![Open this project in Cloud
Shell](http://gstatic.com/cloudssh/images/open-btn.png)](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/Wsine/kindle-calendar&page=editor&open_in_editor=README.md)

**Dependencies**

```bash
# recommended
pip3 install pipenv
pipenv install
# or
pip3 install -r requirements.txt
```

**Bootstarp**
```bash
# recommended
pipenv run python server.py
# or
python3 server.py
```

Then open the entrance by clicking the *Web Preview -> Preview on port 8080* buttons in the top-right cornor.

**Data Input Format**

Adapt to Tencent Questionaire output format. (only last two columns in use)

```txt
# cat template/questionaire.csv
"编号","开始答题时间","结束答题时间","答题时长","地理位置国家和地区","地理位置省","地理位置市","自定义字段","1.你的网络 ID ？","2.你想对日历用户说的正能量话语？(60字以内)",
"1","02-Feb-2021 20:26:58","02-Feb-2021 20:27:09","11","中国","香港","","","正弦定理","怕什么真理无穷，进一寸有一寸的欢喜。",
```

Be patient to wait untill the server generates the customized calendar. The browser will prompt you to download.

Lastly, send the calendar(pdf) to your kindle email address **without CONVERT** in the title.