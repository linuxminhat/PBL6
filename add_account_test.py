from mongoengine import connect
from app.models.artist import Artist
from app.models.user import User
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
# Artist(username='ducchung9', name='Nguyen Duc Chung', email='ducchung9@gmail.com', date_of_birth='2003-01-13').set_password('123456').save()
User(username='nhatminh1', name='Dang Nhat Minh', email='nhatminh1@gmail.com', date_of_birth='2003-01-13').set_password('123456').save()
