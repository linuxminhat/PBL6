from datetime import datetime

from bson import ObjectId
from mongoengine import DateTimeField, EmbeddedDocument, IntField, LazyReferenceField, ObjectIdField, StringField


class Comment(EmbeddedDocument):
    _id = ObjectIdField(default=ObjectId, required=True, primary_key=True)
    user = LazyReferenceField('ExtendedAccount', required=True)
    father_comment_id = ObjectIdField(required=False, default=None)
    father_comment_user = LazyReferenceField('ExtendedAccount', default=None)
    grand_comment_id = ObjectIdField(required=False, default=None)
    content = StringField(required=True)
    like_count = IntField(default=0)
    child_count = IntField(default=0)
    created_at = DateTimeField(default=datetime.now())

    def jsonify(self, current_user=None):
        user = self.user.fetch()
        father_comment_user = self.father_comment_user.fetch() if self.father_comment_user else None

        json = {
            'id': str(self._id),
            'user': {
                'id': str(user.id),
                'name': user.name,
                'avatar_url': user.avatar_url
            },
            'father_comment_id': str(self.father_comment_id),
            'grand_comment_id': str(self.grand_comment_id),
            'content': self.content,
            'like_count': self.like_count,
            'child_count': self.child_count,
            'created_at': self.created_at,
            # Thêm trường user_has_liked mặc định là False
            'user_has_liked': False
        }

        if father_comment_user:
            json['father_comment_user'] = {
                'id': str(father_comment_user.id),
                'name': father_comment_user.name
            }
        # Nếu có current_user => kiểm tra like_comments
        if current_user:
            if self._id in current_user.like_comments:
                json['user_has_liked'] = True

        return json

    def id(self):
        return self._id

    @classmethod
    def from_dict(cls, **data):
        return cls(
            _id=data.get('_id'),
            user=data.get('user'),
            content=data.get('content'),
            father_comment_id=data.get('father_comment_id'),
            grand_comment_id=data.get('grand_comment_id'),
            like_count=data.get('like_count', 0),
            child_count=data.get('child_count', 0),
            created_at=data.get('created_at'),
            father_comment_user=data.get('father_comment_user')
        )

    @property
    def id(self):
        return self._id