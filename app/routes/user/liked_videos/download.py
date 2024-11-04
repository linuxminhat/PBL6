# PBL6/app/routes/user/liked_videos/download.py
from flask import Blueprint, redirect, session, request
from bson import ObjectId
from app.models.video import Video  # Import model Video

user_liked_videos_download_bp = Blueprint('liked_videos_download', __name__)

def get_video_url_from_db(video_id):
    # Truy vấn video trong DB
    video = Video.objects(id=ObjectId(video_id)).first()
    if not video:
        return None
    return video.video_url

@user_liked_videos_download_bp.route('/download', methods=['GET'])
def download():
    video_id = request.args.get('video_id')
    if not video_id:
        return "Video ID is required", 400

    if 'user' not in session:
        return "Not authorized", 401

    video_url = get_video_url_from_db(video_id)
    if not video_url:
        return "Video not found", 404

    # Nếu bạn muốn buộc trình duyệt tải xuống thay vì stream,
    # Trên Cloudinary có thể sử dụng chế độ fl_attachment vào URL.
    # Giả sử URL video dạng: https://res.cloudinary.com/<cloud_name>/video/upload/v.../filename.mp4
    # Ta có thể chèn fl_attachment/ vào trước filename hoặc sau "/upload/"
    # Ví dụ: https://res.cloudinary.com/<cloud_name>/video/upload/fl_attachment:filename.mp4/v.../filename.mp4
    # Hoặc đơn giản: https://res.cloudinary.com/<cloud_name>/video/upload/fl_attachment/filename.mp4
    # Tùy theo cấu trúc URL của bạn.
    # Ví dụ đơn giản (nếu URL có dạng): https://res.cloudinary.com/<cloud_name>/video/upload/v.../filename.mp4
    # Ta chèn "fl_attachment/" ngay sau "upload/"
    # Lưu ý: Đây chỉ là ví dụ, bạn cần kiểm tra chính xác URL thực tế của mình.

    if "/upload/" in video_url:
        parts = video_url.split("/upload/")
        # Giả sử tên file là phần sau upload/
        # Chèn "fl_attachment/" vào
        video_url = parts[0] + "/upload/fl_attachment/" + parts[1]

    return redirect(video_url)
