from mongoengine import connect

from app.models.admin import Admin
from app.models.user import User
from app.models.artist import Artist
from app.models.music import Music
from app.models.genre import Genre
from app.models.embedded_document.word import Lyric

connect('PBL6', uuidRepresentation='standard')

# Admin.objects.all().delete()
# User.objects.all().delete()
# Artist.objects.all().delete()

# Admin(username='admin', name='Admin').set_password('123456').save()
# User(username='sontung', name='Nguyen Thanh Tung', email='sontung@gmail.com', date_of_birth='2003-01-13').set_password('123456').save()
# Artist(username='ducchung0', name='Nguyen Duc Chung', email='ducchung0@gmail.com', date_of_birth='2003-01-13').set_password('123456').save()
# Artist(username='ducchung1', name='Nguyen Duc Chung', email='ducchung1@gmail.com', date_of_birth='2003-01-13').set_password('123456').save()
# Artist(username='ducchung2', name='Nguyen Duc Chung', email='ducchung2@gmail.com', date_of_birth='2003-01-13').set_password('123456').save()
# Artist(username='ducchung3', name='Nguyen Duc Chung', email='ducchung3@gmail.com', date_of_birth='2003-01-13').set_password('123456').save()
# Artist(username='ducchung4', name='Nguyen Duc Chung', email='ducchung4@gmail.com', date_of_birth='2003-01-13').set_password('123456').save()
# Artist(username='ducchung5', name='Nguyen Duc Chung', email='ducchung5@gmail.com', date_of_birth='2003-01-13').set_password('123456').save()
# Artist(username='ducchung6', name='Nguyen Duc Chung', email='ducchung6@gmail.com', date_of_birth='2003-01-13').set_password('123456').save()
# Artist(username='ducchung7', name='Nguyen Duc Chung', email='ducchung7@gmail.com', date_of_birth='2003-01-13').set_password('123456').save()
# Artist(username='ducchung8', name='Nguyen Duc Chung', email='ducchung8@gmail.com', date_of_birth='2003-01-13').set_password('123456').save()
# Artist(nickname='MTP', username='Sơn Tùng M-TP', name='Nguyễn Thanh Tùng', email='mtp@gmail.com', date_of_birth='2003-01-13').set_password('123456').save()
# Artist(nickname='Da LAB', username='Da LAB', name='Da LAB', email='dafuck@gmail.com', date_of_birth='2003-01-13').set_password('123456').save()


lyrics1 = Lyric(order=1, text='Hình như trong lòng anh đã', start_time='00:00:30', end_time='00:00:31.6', artist_index=0)
lyrics2 = Lyric(order=2, text='không còn hình bóng ai ngoài em đó', start_time='00:00:31.6', end_time='00:00:33.6', artist_index=0)
lyrics3 = Lyric(order=3, text='Hằng đêm, anh nằm thao thức suy tư', start_time='00:00:33.7', end_time='00:00:35.9', artist_index=0)
lyrics4 = Lyric(order=4, text='Chẳng nhớ ai ngoài em đâu', start_time='00:00:35.9', end_time='00:00:37.4', artist_index=0)
lyrics5 = Lyric(order=5, text='Vậy nên không cần nói nữa,', start_time='00:00:38.0', end_time='00:00:39.6', artist_index=0)
lyrics6 = Lyric(order=6, text='Yêu mà đòi nói trong vài ba câu', start_time='00:00:39.6', end_time='00:00:41.5', artist_index=0)
lyrics7 = Lyric(order=7, text='Cứ cố quá đâm ra lại hơn...', start_time='00:00:41.9', end_time='00:00:44.0', artist_index=0)
lyrics8 = Lyric(order=8, text='Uh, đau hết cả đầu', start_time='00:00:44.3', end_time='00:00:45.7', artist_index=0)
lyrics9 = Lyric(order=9, text='Đợi chờ em trước nhà từ sáng đến trưa chiều tối', start_time='00:00:45.7', end_time='00:00:48.3', artist_index=0)
lyrics10 = Lyric(order=10, text='Mắc màn đây luôn', start_time='00:00:48.4', end_time='00:00:49.5', artist_index=0)
lyrics11 = Lyric(order=11, text='Ngược nắng hay là ngược gió', start_time='00:00:49.8', end_time='00:00:51.3', artist_index=0)
lyrics13 = Lyric(order=13, text='Miễn anh thấy em tươi vui không buồn', start_time='00:00:51.3', end_time='00:00:53.3', artist_index=0)
lyrics14 = Lyric(order=14, text='Chỉ cần có thấy thế thôi mây xanh chan hòa', start_time='00:00:53.3',end_time='00:00:54.5', artist_index=0)
lyrics = [lyrics1, lyrics2, lyrics3, lyrics4, lyrics5, lyrics6, lyrics7, lyrics8, lyrics9, lyrics10, lyrics11, lyrics13,lyrics14]
Music(name='Song 3', artists=[Artist.objects(username='J97').first(), Artist.objects(username='ducchung0').first()],
      genres=[Genre.objects(name="pop").first()],
      lyrics=[lyrics1, lyrics2, lyrics3, lyrics4]).save()
music_path = 'https://res.cloudinary.com/dddiwftri/video/upload/v1729926809/Dung_lam_trai_tim_anh_dau_gzzviu.wav'
Music(music_url=music_path, name='Đừng làm con tim anh đau',
      artists=[Artist.objects(username='Sơn Tùng M-TP').first()],
      genres=[Genre.objects(name="pop").first()], lyrics=lyrics).save()


# music_url = 'https://res.cloudinary.com/dddiwftri/video/upload/v1730079069/Muonroimasaocon_iqvhqi.mp3'
# lyrics1 = Lyric(order=1, artist_index=0, text='Muộn rồi mà sao còn', start_time='00:00:29.320',end_time='00:00:31.380')
# lyrics2 = Lyric(order=2, artist_index=0, text='Nhìn lên trần nhà rồi quay ra', start_time='00:00:31.380', end_time='00:00:33.770')
# lyrics3 = Lyric(order=3, artist_index=0, text='lại quay vào', start_time='00:00:33.770', end_time='00:00:35.640')
# lyrics4 = Lyric(order=4, artist_index=0, text='Nằm trằng trọc vậy đến sáng mai', start_time='00:00:35.640', end_time='00:00:37.220')
# lyrics5 = Lyric(order=5, artist_index=0, text='Ôm tương tư, nụ cười của ai đó', start_time='00:00:37.220', end_time='00:00:39.090')
# lyrics6 = Lyric(order=6, artist_index=0, text='Làm con tin ngô nghê', start_time='00:00:39.090', end_time='00:00:40.170')
# Music(music_url=music_url, name="test123Muộn rồi mà sao còn", lyrics=[lyrics1, lyrics2,lyrics3,lyrics4,lyrics5,lyrics6], artists=[Artist.objects(username='Sơn Tùng M-TP').first()], genres=[Genre.objects(name="pop").first()]).save()

