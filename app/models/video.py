from datetime import datetime

from mongoengine import DateTimeField, Document, EmbeddedDocumentField, IntField, LazyReferenceField, ListField, \
    StringField, URLField

from .query_set.video_query_set import VideoQuerySet


class Video(Document):
    user = LazyReferenceField('ExtendedAccount', required=True)
    music = LazyReferenceField('Music', required=True)
    score = EmbeddedDocumentField('Score')
    video_url = URLField()
    like_count = IntField(default=0)
    title = StringField()
    comments = ListField(EmbeddedDocumentField('Comment'))

    created_at = DateTimeField(default=datetime.now())
    updated_at = DateTimeField(default=datetime.now())
    deleted_at = DateTimeField()

    meta = {
        'collection': 'videos',
        'queryset_class': VideoQuerySet
    }

    def jsonify(self):
        user = self.user.fetch()

        return {
            'id': str(self.id),
            'user': self.user.fetch().jsonify(),
            'music': self.music.fetch().jsonify(),
            'video_url': self.video_url,
            'like_count': self.like_count,
            'comments': [comment.jsonify() for comment in self.comments],
        }

    @classmethod
    def from_dict(cls, **data):
        from models.embedded_document.comment import Comment
        return cls(
            id=data.get('_id'),
            user=data.get('user'),
            music=data.get('music'),
            score=data.get('score'),
            video_url=data.get('video_url'),
            like_count=data.get('like_count', 0),
            title=data.get('title'),
            comments=[Comment.from_dict(**cmt) for cmt in data.get('comments', [])],
            created_at=data.get('created_at'),
            updated_at=data.get('updated_at'),
            deleted_at=data.get('deleted_at')
        )