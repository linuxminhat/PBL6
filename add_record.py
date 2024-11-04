from mongoengine import connect

from app.models.admin import Admin
from app.models.user import User
from app.models.artist import Artist

connect('PBL6', uuidRepresentation='standard')

Admin.objects.all().delete()
User.objects.all().delete()
Artist.objects.all().delete()

Admin(username='admin', name='Admin').set_password('123456').save()
User(username='sontung', name='Nguyen Thanh Tung', email='sontung@gmail.com', date_of_birth='2003-01-13').set_password('123456').save()
Artist(username='ducchung', name='Nguyen Duc Chung', email='ducchung@gmail.com', date_of_birth='2003-01-13').set_password('123456').save()