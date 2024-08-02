FROM python:3.12.4-alpine3.20

WORKDIR /app

EXPOSE 5051

COPY Pipfile Pipfile.lock ./

RUN pip install pipenv
RUN pipenv requirements > requirements.txt
RUN pip install -r requirements.txt

COPY . ./ 

CMD ["gunicorn", "-b", ":5051", "app:app"]