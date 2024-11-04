from datetime import datetime
from bson import ObjectId
import traceback  # Thêm dòng này
from flask import Blueprint, jsonify, request, g
from flask import session
from app.models.video import Video
from decorators import login_required
from app.models.embedded_document.comment import Comment
from models.enum.account_role import AccountRole
from models.user import User

video_bp = Blueprint('api_video', __name__)


@video_bp.route('/get', methods=['GET'])
def get_video():
    videos = [video.jsonify() for video in Video.get_random_videos(5)]
    return jsonify(videos), 200



@video_bp.route('/like', methods=['POST'])
@login_required(role=AccountRole.USER)
def like_video():
    data = request.get_json()
    video_id = data['videoId']
    user_id = data['userId']

    video_like_count = User.objects(id=user_id).first().add_like_video(video_id)
    if video_like_count == -1:
        return jsonify({'success': False})
    return jsonify({'success': True, 'like_count': video_like_count})


@video_bp.route('/comment', methods=['POST'])
@login_required(role=AccountRole.USER)
def comment_video():
    try:
        data = request.get_json()
        print(f"Received data: {data}")
        user_id = session.get('user').get('id')
        video_id = data.get('videoID')
        content = data.get('comment')
        print(content)

        if not video_id or not content:
            return jsonify({'message': 'Invalid data'}), 400

        video = Video.objects(id=video_id).first()

        if not video:
            return jsonify({'message': 'Video not found'}), 404

        new_comment = Comment(user=user_id, content=content)
        video.update(push__comments=new_comment)
        # video.update(push__comments=new_comment)
        # video.reload()

        # # Lấy bình luận mới nhất từ video
        # latest_comment = video.comments[-1]
        # comment_json = latest_comment.jsonify()
        # print(f"Latest comment JSON: {comment_json}")

        return jsonify({
            'message': 'Comment added successfully',
            'comment_count': len(video.comments)
            # 'comment': comment_json
        }), 200
    except Exception as e:
        print(f"Error in comment_video: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'message': 'Internal server error'}), 500


# API Like bình luận
@video_bp.route('/comment/like', methods=['POST'])
@login_required(role=AccountRole.USER)
def like_comment():
    data = request.get_json()
    comment_id = data['commentId']
    video = Video.objects(comments__id=comment_id).first()
    if video:
        video.update(inc__comments__S__like_count=1)
        return jsonify({'success': True})
    return jsonify({'message': 'Comment not found'}), 404

# API Dislike bình luận
@video_bp.route('/comment/dislike', methods=['POST'])
@login_required(role=AccountRole.USER)
def dislike_comment():
    data = request.get_json()
    comment_id = data['commentId']
    video = Video.objects(comments__id=comment_id).first()
    if video:
        video.update(inc__comments__S__dislike_count=1)
        return jsonify({'success': True})
    return jsonify({'message': 'Comment not found'}), 404

# API Phản hồi bình luận
# @video_bp.route('/comment/reply', methods=['POST'])
# @login_required(role=AccountRole.USER)
# def reply_comment():
#     print("dsds")
#     data = request.get_json()
#     # comment_id = data['commentId']
#     comment_id = ObjectId(data['commentId'])
#     content = data['content']
#
#     user_id = session.get('user').get('id')
#
#     print(f"Received reply for comment ID {comment_id} with content: {content} from user {user_id}")  # kiểm tra dữ liệu nhận được
#
#     video = Video.objects(comments__id=comment_id).first()
#
#     if video:
#         # Tạo phản hồi mới
#         new_reply = Comment(user=user_id, content=content, created_at=datetime.utcnow())
#         video.update(push__comments__S__replies=new_reply)
#         print("Reply added to database successfully")  # kiểm tra khi phản hồi được lưu thành công
#         return jsonify({'message': 'Reply added successfully', 'success': True})
#     print("Comment not found")  # kiểm tra khi comment không tìm thấy
#     return jsonify({'message': 'Comment not found', 'success': False}), 404
@video_bp.route('/comment/reply', methods=['POST'])
@login_required(role=AccountRole.USER)
def reply_comment():
    try:
        data = request.get_json()
        print("Received data:", data)  # Kiểm tra dữ liệu nhận từ request

        comment_id = data.get('commentId')
        if not ObjectId.is_valid(comment_id):
            print("Invalid comment ID format:", comment_id)
            return jsonify({'message': 'Invalid comment ID format'}), 400

        # Chuyển đổi comment_id sang ObjectId
        comment_id_obj = ObjectId(comment_id)
        content = data['content']
        user_id = session.get('user').get('id')
        print("Processing reply for comment ID:", comment_id_obj, "with content:", content, "from user", user_id)

        # Tìm video chứa comment với id tương ứng
        video = Video.objects(comments__match={'id': comment_id_obj}).first()
        if not video:
            print("Video or comment not found.")
            return jsonify({'message': 'Comment not found'}), 404

        # Tạo phản hồi mới
        new_reply = Comment(user=user_id, content=content, created_at=datetime.utcnow())
        print("New reply created:", new_reply)

        # Thêm phản hồi vào bình luận
        video.update(push__comments__S__replies=new_reply)
        print("Reply successfully added.")
        return jsonify({'message': 'Reply added successfully', 'success': True})

    except Exception as e:
        print("Error in reply_comment:", e)
        traceback.print_exc()
        return jsonify({'message': 'Internal server error'}), 500





