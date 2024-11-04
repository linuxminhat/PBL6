from flask import Blueprint, jsonify, request, flash, redirect, url_for, render_template, session
from flask_jwt_extended import get_jwt_identity

from app.decorators import login_required
from app.models.artist import Artist
from app.models.genre import Genre
from app.routes.forms.add_genre_form import AddGenreForm
from models.enum.account_role import AccountRole

admin_genre_bp = Blueprint('genre', __name__)

@admin_genre_bp.route('/list', methods=['GET'])
@login_required(role=AccountRole.ADMIN)
def list():
    genres = Genre.get_all_genre()
    return render_template('admin/genre/list.html', genres=genres)

@admin_genre_bp.route('/add', methods=['GET', 'POST'])
# @login_required(role='admin')
def add():
    form = AddGenreForm()

    if form.validate_on_submit():
        name = form.name.data
        description = form.description.data

        new_genre = Genre(name=name, description=description).save()

        flash('Genre added successfully!', 'success')
        return redirect(url_for('admin.genre.list'))

    return render_template('admin/genre/add.html', form=form)



