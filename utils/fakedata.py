import csv
import random
from faker import Faker

fake = Faker('zh_CN')
header = '"编号","开始答题时间","结束答题时间","答题时长","地理位置国家和地区","地理位置省","地理位置市","自定义字段","1.你的网络 ID ？","2.你想对日历用户说的正能量话语？(60字以内)",'
with open('questionaire.csv', 'w') as file:
    file.write(header + '\n')
    for i in range(1, 400):
        name = fake.name()
        text = fake.text()[:random.randint(10, 60)].replace('\n', '').replace('.', '。')
        record = f'"{i}","","","","","","","","","","{name}","{text}",'
        file.write(record + '\n')
print('Finished.')
