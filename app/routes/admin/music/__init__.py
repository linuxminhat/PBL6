from flask import Blueprint, flash, redirect, render_template, url_for

from app.decorators import login_required
from app.models.music import Music
from app.routes.forms.add_music_form import AddMusicForm
from models.enum.account_role import AccountRole

admin_music_bp = Blueprint('music', __name__)


@admin_music_bp.route('/add', methods=['GET', 'POST'])
@login_required(role=AccountRole.ADMIN)
def add():
    form = AddMusicForm()

    if form.validate_on_submit():
        name = form.name.data
        lyric = form.lyric.data
        uri = form.uri.data

        new_music = Music(name=name, lyric=lyric, uri=uri)
        new_music.save()

        flash('Music added successfully!', 'success')
        return redirect(url_for('music.list_music'))

    return render_template('components/music/add_music.html', form=form)


@admin_music_bp.route('/list', methods=['GET'])
@login_required
def list():
    musics = Music.get_all_music()
    return render_template('components/music/list_music.html', musics=musics)
