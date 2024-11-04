//Bảng thông tin mô tả
//Trạng thái hiện tại của video
function toggleDescription() {
    const descriptionSection = document.getElementById('description-section');
    const videoSection = document.getElementById('video-player').parentElement;

    // Toggle hiển thị của phần mô tả
    if (descriptionSection.classList.contains('d-none')) {
        // Hiển thị mô tả
        descriptionSection.classList.remove('d-none');
        descriptionSection.classList.add('d-block');
        // Cập nhật dữ liệu vào phần mô tả
        const video = videos[currentIndex];
        document.getElementById('like-count-description').innerText = video.like_count || 0;
        document.getElementById('comment-count-description').innerText = video.comments.length || 0;
        document.getElementById('uploader').innerText = video.user.name || 'Người đăng';
    } else {
        // Ẩn mô tả
        descriptionSection.classList.remove('d-block');
        descriptionSection.classList.add('d-none');
    }
    // Đặt lại video chính giữa
    videoSection.scrollIntoView({behavior: 'smooth', block: 'center'});
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Trạng thái riêng tư hay không riêng tư
function togglePrivacy(button) {
    const icon = button.querySelector('i');
    if (icon.classList.contains('bi-globe')) {
        icon.classList.remove('bi-globe');
        icon.classList.add('bi-lock-fill'); // Thay đổi thành icon ổ khóa
    } else {
        icon.classList.remove('bi-lock-fill');
        icon.classList.add('bi-globe'); // Thay đổi thành icon trái đất
    }
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Dặt lại trạng thái của một biểu mẫu phản hồi (feedback form) về trạng thái ban đầu.
function resetFeedbackForm() {
    document.getElementById('feedback-text').value = '';
    document.getElementById('feedback-text').disabled = false;
    document.getElementById('screenshot-button').disabled = false;
    document.getElementById('send-feedback-button').disabled = false;
    document.getElementById('feedback-thank-you').classList.add('d-none');
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Chức năng thích hoặc không thích video hiện tại
function video_like(userId) {
    const videoId = videos[currentIndex].id;

    if (liked) {
        // Người dùng muốn bỏ thích
        axios.post(`${api_video}/unlike`, {videoId: videoId, userId: userId})
            .then(response => {
                if (response.data.success) {
                    // Giảm số lượt thích
                    videos[currentIndex].like_count--;
                    document.getElementById('like-count').innerText = videos[currentIndex].like_count;

                    // Đổi lại màu về trạng thái chưa thích (trắng)
                    const likeButton = document.getElementById('like-button');
                    likeButton.style.backgroundColor = 'white';
                    likeButton.style.color = 'black';

                    // Đặt lại trạng thái liked
                    liked = false;
                }
            })
            .catch(error => console.error('Error unliking the video:', error));
    }
    else {
        // Người dùng muốn thích
        axios.post(`${api_video}/like`, {videoId: videoId, userId: userId})
            .then(response => {
                if (response.data.success) {
                    // Tăng số lượt thích
                    videos[currentIndex].like_count++;
                    document.getElementById('like-count').innerText = videos[currentIndex].like_count;

                    // Đổi màu khi thích (đen)
                    const likeButton = document.getElementById('like-button');
                    likeButton.style.backgroundColor = 'black';
                    likeButton.style.color = 'white';

                    // Đặt lại trạng thái liked
                    liked = true;
                }
            })
            .catch(error => console.error('Error liking the video:', error));
    }
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Chức năng chuyển đổi (toggle) trạng thái hiển thị của phần bình luận
function toggleComment() {
    console.log('toggleComment called');

    const commentSection = document.getElementById('comment-section');
    const videoSection = document.getElementById('video-player').parentElement;

    // Toggle hiển thị của phần comment
    if (commentSection.classList.contains('d-none')) {
        // Hiển thị comment section
        commentSection.classList.remove('d-none');
        commentSection.classList.add('d-block');
    } else {
        // Ẩn comment section
        commentSection.classList.remove('d-block');
        commentSection.classList.add('d-none');
    }

    // Đặt lại video chính giữa
    videoSection.scrollIntoView({behavior: 'smooth', block: 'center'});
}

