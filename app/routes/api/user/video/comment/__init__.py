from flask import Blueprint, request, jsonify, session
from app.models.video import Video
from app.utils.hate_comment_detection import generate_output

api_user_video_comment_bp = Blueprint('api_user_video_comment', __name__)


@api_user_video_comment_bp.route('/insert', methods=['POST'])
def insert_comment():
    data = request.json
    video_id = data.get('videoId')
    content = data.get('content')
    user_id = data.get('userId')
    father_comment_id = data.get('fatherCommentId', None)
    grand_comment_id = data.get('grandCommentId', None)

    if (father_comment_id is None) != (grand_comment_id is None):
        response = {
            "success": False,
            "error": "Both fatherCommentId and grandCommentId must be provided"
        }
        return jsonify(response), 200

    try:
        # Thêm comment vào video
        comment_id = Video.objects.add_comment(user_id=user_id, video_id=video_id, content=content,
                                               father_comment_id=father_comment_id, grand_comment_id=grand_comment_id)
        comment_id = str(comment_id)

        response = {
            "success": True,
            "comment_id": comment_id,
        }

    except Exception as e:
        response = {
            "success": False,
            "error": str(e)
        }
        return jsonify(response), 200

    return jsonify(response), 201


@api_user_video_comment_bp.route('/edit', methods=['PUT'])
def edit_comment():
    data = request.json
    comment_id = data.get('commentId')
    new_content = data.get('content')
    video_id = data.get('videoId')

    print(comment_id, new_content, video_id)

    success = Video.objects.update_comment(video_id, comment_id,
                                           new_content)  # Giả sử có phương thức để lấy comment theo ID

    return jsonify({"success": success}), 200


@api_user_video_comment_bp.route('/delete', methods=['POST'])
def delete_comment():
    data = request.json
    video_id = data.get('videoId')
    comment_id = data.get('commentId')

    if not video_id or not comment_id:
        return jsonify({"success": False, "error": "Missing videoId or commentId"}), 400

    try:
        # Gọi phương thức xóa bình luận trong model Video
        Video.objects.delete_comment(video_id, comment_id)
        response = {"success": True}
    except Exception as e:
        print(f"Error deleting comment: {e}")
        response = {"success": False, "error": str(e)}
        return jsonify(response), 500

    return jsonify(response), 200


@api_user_video_comment_bp.route('/get_replies', methods=['POST'])
def get_replies():
    data = request.json
    comment_id = data.get('commentId')
    video_id = data.get('videoId')
    skip = data.get('skip', 0)

    if not comment_id or not video_id:
        return jsonify({"success": False, "error": "Missing videoId or commentId"}), 400

    from app.models.base.extended_account import ExtendedAccount
    # Load user từ session hoặc request
    # Nếu frontend đã gửi userId thì bạn lấy userId = data.get('userId')
    # Ở đây, giả sử userId lưu trong session:
    user_id = session['user']['id'] if 'user' in session else None
    user = None
    if user_id:
        user = ExtendedAccount.objects(id=user_id).first()

    try:
        replies = Video.objects.get_replies(video_id, comment_id, skip)

        from app.models.embedded_document.comment import Comment
        # Truyền current_user=user vào comment.jsonify()
        rep = [Comment.from_dict(**reply).jsonify(current_user=user) for reply in replies]

        response = {"success": True, "replies": rep}
        return jsonify(response), 200
    except Exception as e:
        print(f"Error getting replies: {e}")
        response = {"success": False, "error": str(e)}
        return jsonify(response), 500

# PBL6/app/routes/api/user/video/comment/__init__.py

@api_user_video_comment_bp.route('/hate_detection', methods=['POST'])
def hate_detection():
    data = request.json
    content = data.get('content')

    if not content or not content.strip():
        return jsonify({"success": False, "content": "Nội dung bình luận không hợp lệ."}), 400

    try:
        # Gọi hàm generate_output để kiểm tra vi phạm
        detection_result = generate_output(content)
        return jsonify({"success": True, "content": detection_result}), 200
    except Exception as e:
        return jsonify({"success": False, "content": str(e)}), 500


# Like Comment
@api_user_video_comment_bp.route('/like', methods=['POST'])
def like_comment():
    data = request.json
    comment_id = data.get('commentId')
    video_id = data.get('videoId')
    user_id = data.get('userId')

    if not comment_id or not video_id or not user_id:
        return jsonify({"success": False, "error": "Missing commentId, videoId or userId"}), 400

    # Gọi phương thức like_comment trong queryset
    like_count = Video.objects.like_comment(user_id=user_id, video_id=video_id, comment_id=comment_id)
    if like_count is not None:
        return jsonify({"success": True, "like_count": like_count})
    else:
        return jsonify({"success": False, "error": "Unable to like comment"}), 400

@api_user_video_comment_bp.route('/unlike', methods=['POST'])
def unlike_comment():
    data = request.json
    comment_id = data.get('commentId')
    video_id = data.get('videoId')
    user_id = data.get('userId')

    if not comment_id or not video_id or not user_id:
        return jsonify({"success": False, "error": "Missing commentId, videoId or userId"}), 400

    # Gọi phương thức unlike_comment trong queryset (bạn cần triển khai logic này trong VideoQuerySet)
    unlike_count = Video.objects.unlike_comment(user_id=user_id, video_id=video_id, comment_id=comment_id)
    if unlike_count is not None:
        return jsonify({"success": True, "like_count": unlike_count})
    else:
        return jsonify({"success": False, "error": "Unable to unlike comment"}), 400
