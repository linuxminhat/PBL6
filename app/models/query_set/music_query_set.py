from bson import ObjectId
from mongoengine import QuerySet



class MusicQuerySet(QuerySet):
    def get_music_by_artist(self, artist_id: str, skip: int = 0, limit: int = 5):
        # Convert artist_id to ObjectId
        artist_id = ObjectId(artist_id)

        # Filter where artist_id is in the 'artists' list
        musics = self.filter(artists__in=[artist_id])

        # Return paginated results and count
        return musics.skip(skip).limit(limit).all(), musics.count()

    def filter_by_artists(self, artist_id):
        return self.filter(artists__contains=artist_id).all()
