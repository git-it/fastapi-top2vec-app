# FastAPI
import os
import urllib
from typing import List, Optional

import databases as databases
import sqlalchemy
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, FileResponse

from fastapi.middleware.cors import CORSMiddleware

# Model
from starlette.staticfiles import StaticFiles

from Top2VecModel import Top2VecModel, Rating
from top2vec import Top2Vec

# top2vec settings
top2vec_model_path = os.environ.get('model_path', 'quran_model.pkl')
top2vec_model_name = os.environ.get('model_name', 'Top2Vec_model')

# start postgres
# docker run --name postgres13 -p 5432:5432 -e POSTGRES_PASSWORD=password -e POSTGRES_DB=ratings -d postgres

# postgresql rater config
host_server = os.environ.get('db_server', 'localhost')
db_server_port = urllib.parse.quote_plus(str(os.environ.get('db_server_port', '5432')))
database_name = urllib.parse.quote_plus(str(os.environ.get('db', 'ratings')))
db_username = urllib.parse.quote_plus(str(os.environ.get('db_username', 'postgres')))
db_password = urllib.parse.quote_plus(str(os.environ.get('db_password', 'password')))
ssl_mode = urllib.parse.quote_plus(str(os.environ.get('db_ssl_mode', 'prefer')))
# 'postgresql://postgres:password@localhost/ratings'
DATABASE_URL = 'postgresql://{}:{}@{}:{}/{}?sslmode={}'.format(db_username, db_password, host_server, db_server_port,
                                                               database_name, ssl_mode)

# create db table
database = databases.Database(DATABASE_URL)
metadata = sqlalchemy.MetaData()
ratings = sqlalchemy.Table(
    "ratings",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("doc_id", sqlalchemy.String),
    sqlalchemy.Column("user", sqlalchemy.String),
    sqlalchemy.Column("event_type", sqlalchemy.String),
    sqlalchemy.Column("event_value", sqlalchemy.String),
    sqlalchemy.Column("rating", sqlalchemy.Integer),
    sqlalchemy.Column("dtoi", sqlalchemy.String),
)
engine = sqlalchemy.create_engine(
    DATABASE_URL
    # , pool_size=2, max_overflow=0
)
metadata.create_all(engine, checkfirst=True)

# load model & init top2vec
top2vec = Top2Vec.load(top2vec_model_path)

# init fastAPI
app = FastAPI(title=top2vec_model_name,
              description="Top2Vec API",
              version="1.0.0", )

app.mount("/static", StaticFiles(directory="/app/explorer/build/static"), name="static")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)


@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    return JSONResponse(
        status_code=404,
        content={"message": str(exc)},
    )


@app.on_event("startup")
async def startup():
    await database.connect()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()


# web app URL
# load ui from .html
@app.get("/app")
def read_index():
    return FileResponse("./explorer/build/index.html")


@app.post("/model/append",
          response_model=dict,
          description="Append a list of documents to existing model."
          )
async def append_documents(documents: list, doc_ids: Optional[list],
                           use_embedding_model_tokenizer: Optional[bool]):
    try:
        top2vec.dd_documents(documents, doc_ids=doc_ids,
                             use_embedding_model_tokenizer=use_embedding_model_tokenizer)
        return {'status': 'success'}
    finally:
        return {'status': 'failed'}


@app.get("/topics/number",
         response_model=Top2VecModel.NumTopics,
         description="Returns number of topics in the model.",
         tags=["Topics"])
async def get_number_of_topics():
    return Top2VecModel.NumTopics(num_topics=top2vec.get_num_topics())


@app.get("/topics/sizes",
         response_model=Top2VecModel.TopicSizes,
         description="Returns the number of documents in each topic.",
         tags=["Topics"])
async def get_topic_sizes():
    topic_sizes, topic_nums = top2vec.get_topic_sizes()
    return Top2VecModel.TopicSizes(topic_nums=list(topic_nums),
                                   topic_sizes=list(topic_sizes))


@app.get("/topics/get",
         response_model=List[Top2VecModel.Topic],
         description='returns _top_ words per topic as used in word cloud',
         tags=["Topics"]
         )
async def get_topics():
    words, scores, topics = top2vec.get_topics()
    topics_out = []
    for word_list, word_scores, topic_num in zip(words, scores, topics):
        topics_out.append(Top2VecModel.Topic(topic_num=topic_num,
                                             topic_words=list(word_list),
                                             word_scores=list(word_scores)))
    return topics_out


@app.post("/topics/search",
          response_model=List[Top2VecModel.TopicResult],
          description="Semantic search of topics using keywords.",
          tags=["Topics"])
async def search_topics_by_keywords(keyword_search: Top2VecModel.KeywordSearchTopic):
    topic_words, word_scores, topic_scores, topic_nums = top2vec.search_topics(keyword_search.keywords,
                                                                               keyword_search.num_topics,
                                                                               keyword_search.keywords_neg)

    topic_results = []
    for words, word_scores, topic_score, topic_num in zip(topic_words, word_scores, topic_scores, topic_nums):
        topic_results.append(Top2VecModel.TopicResult(topic_num=topic_num, topic_words=list(words),
                                                      word_scores=list(word_scores), topic_score=topic_score))

    return topic_results


@app.post("/documents/search-by-keywords",
          response_model=List[Top2VecModel.Document],
          description="Search documents by keywords. Optionally, filter results by topic (result must be part of "
                      "topic(s) in post)",
          tags=["Documents"])
async def search_documents_by_keywords(keyword_search: Top2VecModel.KeywordSearchDocument):
    documents = []

    if top2vec.documents:
        docs, doc_scores, doc_ids = top2vec.search_documents_by_keywords(keyword_search.keywords,
                                                                         keyword_search.num_docs,
                                                                         keyword_search.keywords_neg)
        for doc, score, num in zip(docs, doc_scores, doc_ids):
            if keyword_search.topics and top2vec.doc_top[num] in keyword_search.topics:
                documents.append(Top2VecModel.Document(content=doc, score=score, doc_id=num))
            elif not keyword_search.topics:
                documents.append(Top2VecModel.Document(content=doc, score=score, doc_id=num))
    else:
        doc_scores, doc_ids = top2vec.search_documents_by_keywords(keyword_search.keywords,
                                                                   keyword_search.num_docs,
                                                                   keyword_search.keywords_neg)
        for score, num in zip(doc_scores, doc_ids):
            documents.append(Top2VecModel.Document(score=score, doc_id=num))

    return documents


@app.post("/rating/", response_model=bool)
async def add_rating(rating_in: Rating):
    query = ratings.insert().values(
        doc_id=rating_in.doc_id,
        user=rating_in.user,
        event_type=rating_in.event_type,
        event_value=rating_in.event_value,
        dtoi=rating_in.dtoi,
        rating=rating_in.rating
    )
    try:
        last_record_id = await database.execute(query)
        print('last_record_id ', last_record_id)
        return True
    except Exception as e:
        print("ERROR ", e)
    finally:
        return False
