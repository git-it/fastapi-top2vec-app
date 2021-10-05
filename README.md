# Top2Vec as a service 

Basic (docker) to enable many serving and exploration of a top2vec (https://github.com/ddangelov/Top2Vec) model

Kudos and much thanks to ddangelov for creating the awesome Top2Vec library.

## Tech Stack

* Backend: FastAPI
* Frontend: React
* Db: postgres - not much use yet. stores user ratings of docs for future recommender

## To Run 
```
git clone
cd into dr
docker compose up 
```
go to http://localhost:8080/app to launch webapp or http://localhost:8080/docs for APIs

## Dev setup

1. clone and install python dependencies
```
git clone
pip install -r requirements.txt
``` 

2. train Top2Vec on a corpus [ modify ]
```
# example script 
python create_example_model_from_The_Quran.py
```

3. launch the model prediction API
```
uvicorn api:app --reload
```

4. check the vue app at localhost:8000/app


![](./images/screenshot.gif)
