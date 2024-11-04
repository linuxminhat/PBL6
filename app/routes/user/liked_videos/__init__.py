# PBL6/app/routes/user/liked_videos/__init__.py

from flask import Blueprint, render_template, session, redirect, url_for
from app.decorators import login_required
from app.models.base.extended_account import ExtendedAccount
from app.models.video import Video

user_liked_videos_bp = Blueprint('liked_videos', __name__)

@user_liked_videos_bp.route('/', methods=['GET'])
@login_required()
def show_liked_videos():


    user_id = session['user']['id']
    current_user = ExtendedAccount.objects(id=user_id).first()
    liked_videos_refs = getattr(current_user, 'like_videos', [])

    # Nếu user chưa like video nào
    if not liked_videos_refs:
        return render_template('user/liked_videos/liked_videos.html', user=current_user, last_video=None, all_videos=[])

    # Lấy video cuối cùng (video mới like nhất)
    last_video_ref = liked_videos_refs[-1]  # Đây là một LazyReference
    last_video = last_video_ref.fetch()  # Truy cập đối tượng Video

    # Lấy tất cả video đã thích
    # Tối ưu hóa truy vấn bằng cách lấy tất cả ObjectId và truy vấn một lần
    all_video_ids = [video_ref.id for video_ref in liked_videos_refs]
    all_videos = Video.objects(id__in=all_video_ids).all()

    print('all liked', all_videos)

    return render_template('user/liked_videos/liked_videos.html', user=current_user, last_video=last_video, all_videos=all_videos)
