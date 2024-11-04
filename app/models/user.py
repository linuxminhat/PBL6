from mongoengine import LazyReferenceField, ListField

from .base.extended_account import ExtendedAccount
from .enum.account_role import AccountRole
from .genre import Genre


class User(ExtendedAccount):
    favourite_genres = ListField(LazyReferenceField(Genre))  # Embedded list field for favourite genres

    def jsonify(self):
        return super().jsonify() | {
            'role': AccountRole.USER.value,
        }
