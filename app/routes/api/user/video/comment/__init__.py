from flask import Blueprint, request, jsonify

from models.video import Video

api_user_video_comment_bp = Blueprint('api_user_video_comment', __name__)


@api_user_video_comment_bp.route('/insert', methods=['POST'])
def insert_comment():
    data = request.json
    video_id = data.get('videoId')
    content = data.get('content')
    user_id = data.get('userId')
    to_comment_id = data.get('toCommentId')

    try:
        comment_id = Video.objects.add_comment(user_id=user_id, video_id=video_id, content=content,
                                               to_comment_id=to_comment_id)
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
        return jsonify(response), 400

    return jsonify(response), 200
