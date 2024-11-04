from elasticsearch import Elasticsearch

es = Elasticsearch("http://localhost:9999", basic_auth=('elastic', 'gbtrZmXh4FDbkES3aJ6O'))
# assert es.ping()