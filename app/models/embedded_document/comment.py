from datetime import datetime

from bson import ObjectId
from mongoengine import DateTimeField, EmbeddedDocument, IntField, LazyReferenceField, ObjectIdField, StringField


class Comment(EmbeddedDocument):
    _id = ObjectIdField(default=ObjectId, required=True, primary_key=True)
    user = LazyReferenceField('ExtendedAccount', required=True)
    to_comment = LazyReferenceField('Comment', required=False)
    content = StringField(required=True)
    like_count = IntField(default=0)
    created_at = DateTimeField(default=datetime.now())
    deleted_at = DateTimeField(default=None)

    def jsonify(self):
        user = self.user.fetch()

        return {
            'id': str(self._id),
            'user': self.user.fetch().jsonify(),
            # 'to_comment': self.to_comment.fetch().jsonify() if self.to_comment else None,
            'content': self.content,
            'like_count': self.like_count,
            'created_at': self.created_at,
        }

    @property
    def id(self):
        return self._id

    @classmethod
    def from_dict(cls, **data):
        return cls(
            _id=data.get('_id'),
            user=data.get('user'),
            content=data.get('content'),
            to_comment=data.get('to_comment'),
            like_count=data.get('like_count', 0),
            created_at=data.get('created_at'),
            deleted_at=data.get('deleted_at')
        )
