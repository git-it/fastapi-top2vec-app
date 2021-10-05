FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9
COPY ./app /app
COPY ./quran_model.pkl /app/quran_model.pkl
COPY ./requirements.txt /app/requirements.txt

ENV model_name="Top2Vec as a service"
ENV model_path=/quran_model.pkl

# not all these ENV variables are needed we are demonstrating the defaults
# ENV host_server=localhost
ENV db_server_port=5432
ENV db=ratings
ENV db_username=postgres
ENV db_password=password
ENV db_ssl_mode=prefer

RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt