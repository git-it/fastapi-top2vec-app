import requests
from top2vec import Top2Vec

urls = []
documents = []
#
# count = 0
# host = 'http://www.boredapi.com/api/activity'
# while count < 50:
#     a = requests.get(host).json()
#     url = '%s/api/activity?key=%s' % (host, a['key'])
#     if url not in urls:
#         documents.append(a['activity'])
#         urls.append(url)
#         count += 1
#         print(count)
#
# host = 'https://jsonplaceholder.typicode.com/posts'
# a = requests.get(host).json()
# for k in a:
#     urls.append('%s/%d' % (host, k['id']) )
#     documents.append(k['body'])
#
# ## get more crap
# todos = 'https://jsonplaceholder.typicode.com/todos'
# a = requests.get(todos).json()
# for k in a:
#     urls.append('%s/%d' % (todos, k['id']))
#     documents.append(k['title'])

## quran
# docs: https://github.com/fawazahmed0/quran-api
# https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ben-muhiuddinkhan-lad/5/1.json

quran = 'https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/eng-abdulhye.json'
resp = requests.get(quran).json()
for r in resp['quran']:
    # store verses as docs
    url = '%s/%d/%d.json' % (quran.rstrip('.json'), r['chapter'], r['verse'])
    urls.append(url)
    documents.append(r['text'])


model = Top2Vec(documents=documents,
                keep_documents=False,
                document_ids=urls)
print(model)
model.save('quran_model.pkl')
print('Model created and saved')
