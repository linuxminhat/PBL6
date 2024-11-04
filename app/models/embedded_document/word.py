from mongoengine import EmbeddedDocument, IntField, StringField


class Word(EmbeddedDocument):
    start_time = IntField(min_value=0)
    end_time = IntField(min_value=0)
    word = StringField()

    def jsonify(self):
        return {
            'word': self.word,
            'start_time': self.start_time,
            'end_time': self.end_time,
        }
