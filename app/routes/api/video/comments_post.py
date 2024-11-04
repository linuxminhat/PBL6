from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.video import Video
from app.models.embedded_document.comment import Comment

video_bp = Blueprint('video', __name__)

@video_bp.route('/comment', methods=['POST'])
@jwt_required()
def post_comment():
    video_id = 'some_video_id'  # Lấy video_id từ request hoặc context
    video = Video.objects(id=video_id).first()
    if not video:
        return jsonify({"error": "Video not found"}), 404

    user_id = get_jwt_identity()  # Lấy thông tin user đã đăng nhập
    comment_content = request.json.get('content', '')

    if not comment_content:
        return jsonify({"error": "Comment content is required"}), 400

    # Tạo comment mới
    new_comment = Comment(user=user_id, content=comment_content)
    video.comments.append(new_comment)
    video.save()

    return jsonify({"success": True, "comment": new_comment.jsonify()}), 201
