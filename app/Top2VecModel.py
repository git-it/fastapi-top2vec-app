from pydantic import BaseModel
from typing import List, Optional, Union


class Document(BaseModel):
    content: Optional[str]
    score: float
    doc_id: Union[str, int]


class DocumentSearch(BaseModel):
    doc_ids: List[Union[str, int]]
    doc_ids_neg: List[Union[str, int]]
    num_docs: int


class NumTopics(BaseModel):
    num_topics: int


class TopicSizes(BaseModel):
    topic_nums: List[int]
    topic_sizes: List[int]


class Topic(BaseModel):
    topic_num: int
    topic_words: List[str]
    word_scores: List[float]


class TopicResult(Topic):
    topic_score: float


class KeywordSearch(BaseModel):
    keywords: List[str]
    keywords_neg: Optional[List[str]]


class KeywordSearchDocument(KeywordSearch):
    num_docs: int
    topics: Optional[List[int]]


class KeywordSearchTopic(KeywordSearch):
    num_topics: int


class KeywordSearchWord(KeywordSearch):
    num_words: int


class WordResult(BaseModel):
    word: str
    score: float


class Top2VecModel(object):
    Document = Document
    DocumentSearch = DocumentSearch
    NumTopics = NumTopics
    TopicSizes = TopicSizes
    Topic = Topic
    TopicResult = TopicResult
    KeywordSearch = KeywordSearch
    KeywordSearchDocument = KeywordSearchDocument
    KeywordSearchTopic = KeywordSearchTopic
    KeywordSearchWord = KeywordSearchWord
    WordResult = WordResult


class Rating(BaseModel):
    doc_id: str
    user: str
    event_type: str
    event_value: str
    dtoi: str
    rating: int
