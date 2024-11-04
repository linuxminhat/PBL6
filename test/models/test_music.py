import unittest
from datetime import datetime, time

from mongoengine import connect, disconnect

from app.models.artist import Artist
from app.models.music import Music
from app.models.genre import Genre
from app.models.embedded_document.word import Lyric


class TestFollow(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # This method will be called before any test class
        connect('PBL6_test', uuidRepresentation='standard')

    @classmethod
    def tearDownClass(cls):
        # This method will be called after any test class
        disconnect()

    def setUp(self):
        self.genre1 = Genre(name='Pop', description='Pop music')
        self.genre2 = Genre(name='Rock', description='Rock music')
        self.genre3 = Genre(name='Jazz', description='Jazz music')

        self.artist1 = Artist(username='jack97', name='Phương Tuấn', email='jack97@example.com', date_of_birth=datetime.strptime('1997-04-12', "%Y-%m-%d"), bio='Bỏ con').set_password('11111111')
        self.artist2 = Artist(username='tung.mtp', name='Sơn Tùng', email='sontung@mtp.com', date_of_birth=datetime.strptime('1994-07-05', "%Y-%m-%d"), bio='Best pop').set_password('11111111')

        self.lyrics1 = Lyric(order=1, text='Thiên lý ơi em có thể ở lại đây không', start_time='00:00:01.123', end_time='00:00:04.456', artist_index=0)
        self.lyrics2 = Lyric(order=2, text='Chạy ngay đi', artist_index=1).set_start_time(time(0, 0, 5, 678)).set_end_time('00:00:07.901')

        self.music1 = Music(name='Song 1', artists=[self.artist1, self.artist2], genres=[self.genre1, self.genre2, self.genre3], music_url='https://music.com/song1',metric_url='https://metrics.com/song1_metric.json',lyrics=[self.lyrics1, self.lyrics2])

    def tearDown(self):
        Artist.objects.all().delete()
        Genre.objects.all().delete()
        Music.objects.all().delete()

    def test_favourite_genres(self):
        self.genre1.save()
        self.genre2.save()
        self.genre3.save()

        self.artist1.save()
        self.artist2.save()

        self.music1.save()

        self.assertEqual(Music.objects.count(), 1)

