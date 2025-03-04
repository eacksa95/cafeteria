FROM python:3.11.2

RUN mkdir -p /cafeteria/app
COPY . /cafeteria/app
WORKDIR /cafeteria/app

RUN pip install --upgrade pip

RUN pip install -r requirements.txt

# RUN python manage.py makemigrations productos
# RUN python manage.py makemigrations pedidos
# RUN python manage.py makemigrations users
# RUN python manage.py migrate

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]