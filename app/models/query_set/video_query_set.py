from bson import ObjectId
from mongoengine import QuerySet
from pymongo import MongoClient

from app.models.base.extended_account import ExtendedAccount
from models.embedded_document.comment import Comment


class VideoQuerySet(QuerySet):
    def get_videos_by_user(self, user_id: str):
        return self.filter(user=user_id).all()

    def like_video(self, user_id: str, video_id: str):
        video_id = ObjectId(video_id)
        user = ExtendedAccount.objects(id=user_id).first()

        if not any(like_video.id == video_id for like_video in user.like_videos):
            with MongoClient().start_session() as session:
                with session.start_transaction():
                    try:
                        video = self.filter(id=video_id).first()
                        if video:
                            user.like_videos.append(video_id)
                            user.save()
                            video.update(inc__like_count=1)
                            return video.like_count + 1
                    except Exception as e:
                        print(f"Transaction aborted due to: {e}")
                        raise

    def unlike_video(self, user_id: str, video_id: str):
        video_id = ObjectId(video_id)
        user = ExtendedAccount.objects(id=user_id).first()

        if any(like_video.id == video_id for like_video in user.like_videos):
            with MongoClient().start_session() as session:
                with session.start_transaction():
                    try:
                        video = self.filter(id=video_id).first()
                        if video:
                            user.like_videos.remove(video)
                            user.save()
                            video.update(inc__like_count=-1)
                            return video.like_count - 1
                    except Exception as e:
                        print(f"Transaction aborted due to: {e}")
                        raise

    def add_comment(self, user_id: str, video_id: str, content: str, to_comment_id: str):
        comment = Comment(user=user_id, to_comment=to_comment_id, content=content)

        with MongoClient().start_session() as session:
            with session.start_transaction():
                try:
                    video = self.filter(id=video_id).first()
                    if video:
                        video.comments.append(comment)
                        video.save()
                        return comment.id
                except Exception as e:
                    print(f"Transaction aborted due to: {e}")
                    raise

    def like_comment(self, user_id: str, video_id: str, comment_id: str):
        user = ExtendedAccount.objects(id=user_id).first()

        with MongoClient().start_session() as session:
            with session.start_transaction():
                try:
                    video = self.filter(id=video_id).first()
                    if video:
                        for comment in video.comments:
                            if comment.id == comment_id:
                                if not any(like_comment.id == comment_id for like_comment in user.like_comments):
                                    user.like_comments.append(comment_id)
                                    user.save()
                                    comment.update(inc__like_count=1)
                                    return comment.like_count + 1
                except Exception as e:
                    print(f"Transaction aborted due to: {e}")
                    raise
