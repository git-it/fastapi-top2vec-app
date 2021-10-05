# Top2Vec as a service 

Enable exploration of a top2vec model

## Tech Stack

* Backend: FastAPI
* Frontend: React

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