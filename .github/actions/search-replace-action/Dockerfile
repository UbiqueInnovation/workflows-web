FROM python:latest

ADD requirements.txt /requirements.txt
ADD string_replace.py /string_replace.py

RUN pip install -r requirements.txt
CMD [ "python3", "/string_replace.py" ]