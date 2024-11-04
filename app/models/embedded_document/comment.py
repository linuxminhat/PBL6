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

    def jsonify(self):
        return {
            'id': str(self._id),
            'user': self.user.fetch().jsonify(),
            # 'to_comment': self.to_comment.fetch().jsonify() if self.to_comment else None,
            'content': self.content,
            'like_count': self.like_count,
            'created_at': self.created_at,
        }
# from datetime import datetime
# from app.models.user import User
#
# from bson import ObjectId
# from mongoengine import (
#     EmbeddedDocument,
#     ObjectIdField,
#     ReferenceField,
#     StringField,
#     IntField,
#     DateTimeField,
# )
#
#
# class Comment(EmbeddedDocument):
#     _id = ObjectIdField(required=True, default=ObjectId)
#     user = ReferenceField('User', required=True)
#     content = StringField(required=True)
#     like_count = IntField(default=0)
#     created_at = DateTimeField(default=datetime.utcnow)
#
#     def jsonify(self):
#         user = self.user
#         return {
#             'id': str(self._id),
#             'user': user.jsonify() if user else None,
#             'content': self.content,
#             'like_count': self.like_count,
#             'created_at': self.created_at.isoformat(),
#         }
# from mongoengine import (
#     EmbeddedDocument,
#     ObjectIdField,
#     ReferenceField,
#     StringField,
#     IntField,
#     DateTimeField,
# )
# from bson import ObjectId
# from datetime import datetime
#
# # Không import User ở đây
#
# class Comment(EmbeddedDocument):
#     _id = ObjectIdField(required=True, default=ObjectId)
#     user = ReferenceField('User', required=True)  # Sử dụng chuỗi tên lớp 'User'
#     content = StringField(required=True)
#     like_count = IntField(default=0)
#     created_at = DateTimeField(default=datetime.utcnow)
#
#     def jsonify(self):
#         # Import User cục bộ để tránh vòng lặp
#         from app.models.user import User
#
#         user = self.user
#         if user:
#             # Nếu user là một đối tượng DBRef hoặc tương tự, bạn có thể cần tải nó
#             if isinstance(user, (str, bytes)):
#                 user = User.objects(id=user).first()
#         else:
#             user = None
#
#         return {
#             'id': str(self._id),
#             'user': user.jsonify() if user else None,
#             'content': self.content,
#             'like_count': self.like_count,
#             'created_at': self.created_at.isoformat(),
#         }

