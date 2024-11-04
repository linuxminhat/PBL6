/* Render Comment */
function renderCommentsForVideo(video) {
    const commentContainer = document.getElementById('comment-container');
    commentContainer.innerHTML = ''; // Xóa các bình luận cũ
    let ul = document.createElement('ul');
    ul.classList.add('list-unstyled');
    video.comments.forEach(comment => {
        let li = renderComment(comment);
        ul.appendChild(li);
    });
    commentContainer.appendChild(ul);
}

function renderNewCommentForVideo(video, comment) {
    const commentContainer = document.getElementById('comment-container');
    let ul = document.createElement('ul');
    ul.classList.add('list-unstyled');
    let li = renderComment(comment);
    ul.appendChild(li);
    commentContainer.appendChild(ul);
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* Toggle Reply Section */
function toggleReplySection(commentId) {
    const replySection = document.getElementById(`reply-section-${commentId}`);
    replySection.classList.toggle('d-none');
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* view replies */
function viewReplies(event) {
    let btn = event.target;
    let skip = parseInt(btn.getAttribute('data-reply-skip'));
    let child_count = btn.getAttribute('data-child-count');
    let commentId = btn.getAttribute('comment-id');
    let video = videos[currentIndex];

    axios.post(`${api_video_comment}/get_replies`, {videoId: video.id, commentId: commentId, skip: skip})
        .then(response => {
            console.log(response.data);
            if (response.data.success) {
                const replies = response.data.replies;
                console.log('replies:', replies);
                skip += replies.length;
                btn.setAttribute('data-reply-skip', skip);
                let numLeftComments = parseInt(child_count) - skip;
                // alert(`Xem thêm ${parseInt(child_count) - skip} bình luận`);
                 btn.innerText = numLeftComments > 0 ? `Xem thêm ${numLeftComments} bình luận` : '';

                let ul = document.getElementById(`replies-container-${commentId}`);
                response.data.replies.forEach(reply => {
                    let li = renderComment(reply, 'reply', commentId);
                    ul.appendChild(li);
                });
            }
        })
        .catch(error => console.error('Error viewing replies:', error));
}

/* Submit Reply */
function submitReply(input, fatherCommentId, grandCommentId, father_comment_user = null) {
    const replyContent = input.value.trim();
    input.value = ''; // Xóa nội dung trong ô nhập

    if (replyContent) {
        let data = {
            videoId: videos[currentIndex].id,
            content: replyContent,
            userId: sessionUser.id,
            fatherCommentId: fatherCommentId,
            grandCommentId: grandCommentId,
        }
        axios.post(`${api_video_comment}/hate_detection`, { content: replyContent })
            .then(res => {
                if (res.data.success) {
                    const detectionResult = res.data.content;
                    if (hate_regex.test(detectionResult) === true) {
                        // Vi phạm => hiển thị modal
                        const violationModal = new bootstrap.Modal(document.getElementById('violationWarningModal'));
                        violationModal.show();
                    } else {
                        axios.post(`${api_video_comment}/insert`, data)
                            .then(response => {
                                const resp = response.data;
                                if (resp.success) {
                                    // Lấy dữ liệu phản hồi mới từ server
                                    const replyId = resp.comment_id; // get reply comment id return by server
                                    let comment = {
                                        id: replyId,
                                        user: sessionUser,
                                        father_comment_user: father_comment_user,
                                        content: replyContent,
                                        like_count: 0,
                                        dislike_count: 0,
                                        createdAt: new Date(),
                                        child_count: 0
                                    }
                                    let newReply = renderComment(comment, 'reply', grandCommentId);
                                    let replyContainer = document.getElementById(`replies-container-${grandCommentId}`);
                                    replyContainer.insertBefore(newReply, replyContainer.firstChild);
                                    // 2) Tăng total_comments_count
                                    videos[currentIndex].total_comments_count += 1;
                                    document.getElementById('comment-count').innerText = videos[currentIndex].total_comments_count;
                                    // update grand comment child_count
                                    videos[currentIndex].comments.find(comment => comment.id === grandCommentId).child_count += 1;
                                } else {
                                    alert('Gửi phản hồi không thành công.');
                                }
                            })
                            .catch(error => {
                                console.error('Error submitting reply:', error);
                                alert('Đã xảy ra lỗi khi gửi phản hồi.');
                            });
                    }
                } else {
                    alert('Đã xảy ra lỗi trong quá trình kiểm tra bình luận.');
                }
            })
            .catch(error => {
                console.error('Error during hate detection:', error);
                alert('Đã xảy ra lỗi khi kiểm tra bình luận.');
            });
    } else {
        alert('Vui lòng nhập nội dung phản hồi');
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* Like comment */
function likeComment(commentId) {
    const video = videos[currentIndex];
    if (!sessionUser || !sessionUser.id) {
        alert('Vui lòng đăng nhập để thực hiện chức năng này');
        return;
    }

    const likeButton = document.querySelector(`button[data-like-comment-id="${commentId}"]`);
    const likeCountSpan = likeButton.querySelector('span');
    let isLiked = likeButton.classList.contains('liked');

    if (isLiked) {
        // Người dùng đã like, giờ nhấn lại là unlike
        axios.post(`${api_video_comment}/unlike`, {
            commentId: commentId,
            videoId: video.id,
            userId: sessionUser.id
        })
            .then(response => {
                // console.log(response.data);
                if (response.data.success) {
                    // Cập nhật số like sau khi unlike
                    likeCountSpan.innerText = response.data.like_count;
                    // Bỏ class liked và đổi màu nút về trắng
                    likeButton.classList.remove('liked');
                    likeButton.classList.remove('btn-dark');
                    likeButton.classList.add('btn-light');

                    // Cập nhật dữ liệu trong videos[currentIndex].comments
                    let cmt = video.comments.find(c => c.id === commentId);
                    if (cmt) {
                        cmt.like_count = response.data.like_count;
                        cmt.user_has_liked = false;
                    }

                } else {
                    alert('Không thể bỏ like bình luận này.');
                }
            })
            .catch(error => console.error('Error unliking the comment:', error));
    } else {
        // Người dùng chưa like, nhấn like
        axios.post(`${api_video_comment}/like`, {
            commentId: commentId,
            videoId: video.id,
            userId: sessionUser.id
        })
            .then(response => {
                if (response.data.success) {
                    // Cập nhật số like sau khi like
                    likeCountSpan.innerText = response.data.like_count;
                    // Thêm class liked và đổi màu nút sang đen
                    likeButton.classList.add('liked');
                    likeButton.classList.remove('btn-light');
                    likeButton.classList.add('btn-dark');

                    // Cập nhật dữ liệu trong videos[currentIndex].comments
                    let cmt = video.comments.find(c => c.id === commentId);
                    if (cmt) {
                        cmt.like_count = response.data.like_count;
                        cmt.user_has_liked = true;
                    }

                } else {
                    // Trường hợp nếu server trả về đã like trước đó
                    // alert('Không thể like bình luận này. Có thể bạn đã like trước đó.');
                    // Hoặc bạn xử lý logic khác nếu cần
                    alert('Bạn đã like bình luận này trước đó.');
                }
            })
            .catch(error => console.error('Error liking the comment:', error));
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* Dislike comment */
function dislikeComment(commentId) {
    axios.post(`${api_video_comment}/dislike`, {commentId: commentId})
        .then(response => {
            if (response.data.success) {
                // Tìm và cập nhật số lượt dislike
                const dislikeButton = document.querySelector(`[onclick="dislikeComment('${commentId}')"]`);
                let dislikeCount = parseInt(dislikeButton.textContent.trim());
                dislikeButton.innerHTML = `<i class="bi bi-hand-thumbs-down-fill"></i> ${dislikeCount + 1}`;
            }
        })
        .catch(error => console.error('Error disliking the comment:', error));
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* Edit Comment */
function editComment(commentId) {
    console.log('editComment called with commentId:', commentId);

    const commentItem = document.querySelector(`[data-comment-id="${commentId}"]`);
    const comment_content_element = commentItem.querySelector('div.d-flex.align-items-center').querySelector('div.flex-grow-1');
    const comment_content = comment_content_element.querySelector('p.mb-1');

    // Nếu đã có ô nhập liệu, không tạo thêm
    if (commentItem.querySelector('.edit-input')) return;

    // Tạo ô nhập liệu và điền nội dung hiện tại
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.classList.add('form-control', 'edit-input');
    editInput.value = comment_content.innerText;

    const saveButton = document.createElement('button');
    saveButton.classList.add('btn', 'btn-success', 'btn-sm', 'mt-1', 'me-2');
    saveButton.innerText = 'Lưu';
    const cancelButton = document.createElement('button');
    cancelButton.classList.add('btn', 'btn-secondary', 'btn-sm', 'mt-1');
    cancelButton.innerText = 'Hủy';
    const actionContainer = commentItem.querySelector('.d-flex.align-items-center.mt-1');
    actionContainer.innerHTML = '';
    actionContainer.appendChild(saveButton);
    actionContainer.appendChild(cancelButton);

    // Tạo nút lưu

    saveButton.onclick = () => saveEditedComment(
        commentId,
        editInput.value,
        comment_content_element,
        editInput,
        comment_content,
        actionContainer,
        saveButton,
        cancelButton
    );
    // Tạo nút hủy
    comment_content_element.replaceChild(editInput, comment_content);
    cancelButton.onclick = () => cancelEditComment(
        commentId,
        comment_content.innerText,
        comment_content_element,
        editInput,
        comment_content,
        actionContainer,
        saveButton,
        cancelButton);
    // Thay thế nội dung bình luận bằng ô nhập liệu và các nút
}

/* Cancel Edit Comment */
// function cancelEditComment(commentId) {
//     const commentItem = document.querySelector(`[data-comment-id="${commentId}"]`);
//     const editInput = commentItem.querySelector('.edit-input');
//
//     // Lấy lại nội dung gốc từ thuộc tính data
//     const originalContent = editInput.defaultValue;
//
//     // Tạo phần tử <p> mới với nội dung gốc
//     const originalCommentContent = document.createElement('p');
//     originalCommentContent.classList.add('mb-1');
//     originalCommentContent.innerText = originalContent;
//
//     // Thay thế trường nhập liệu bằng phần tử <p>
//     commentItem.replaceChild(originalCommentContent, editInput);
//
//     // Khôi phục các nút hành động ban đầu (like, dislike, reply)
//     const actionContainer = commentItem.querySelector('.d-flex.align-items-center.mt-1');
//     actionContainer.innerHTML = ''; // Xóa các nút hiện tại
//
//     // Thêm lại các nút like, dislike, và reply
//     const likeButton = document.createElement('button');
//     likeButton.classList.add('icon-button', 'me-2', 'btn', 'btn-light', 'btn-sm');
//     likeButton.onclick = () => likeComment(commentId);
//     likeButton.innerHTML = `<i class="bi bi-hand-thumbs-up"></i> <span>${originalContent.like_count || 0}</span>`;
//     actionContainer.appendChild(likeButton);
//
//     const dislikeButton = document.createElement('button');
//     dislikeButton.classList.add('icon-button', 'me-2', 'btn', 'btn-light', 'btn-sm');
//     dislikeButton.onclick = () => dislikeComment(commentId);
//     dislikeButton.innerHTML = `<i class="bi bi-hand-thumbs-down"></i> <span>${originalContent.dislike_count || 0}</span>`;
//     actionContainer.appendChild(dislikeButton);
//
//     const replyButton = document.createElement('button');
//     replyButton.classList.add('icon-button', 'btn', 'btn-light', 'btn-sm');
//     replyButton.onclick = () => toggleReplySection(commentId);
//     replyButton.innerHTML = `<i class="bi bi-reply"></i> Phản hồi`;
//     actionContainer.appendChild(replyButton);
// }

function cancelEditComment(commentId) {
    let video = videos[currentIndex];
    let cmtIndex = video.comments.findIndex(c => c.id === commentId);
    if (cmtIndex === -1) return;

    const originalComment = video.comments[cmtIndex];
    const commentItem = document.querySelector(`[data-comment-id="${commentId}"]`);

    if (commentItem) {
        let parentUl = commentItem.parentNode;
        let nextSibling = commentItem.nextSibling;
        // Xóa commentItem hiện đang ở trạng thái chỉnh sửa
        parentUl.removeChild(commentItem);

        // Render lại comment với nội dung ban đầu
        let newCommentElement = renderComment(originalComment);

        if (nextSibling) {
            parentUl.insertBefore(newCommentElement, nextSibling);
        } else {
            parentUl.appendChild(newCommentElement);
        }
    }
}

/* Save Edited Comment */
// function saveEditedComment(commentId,
//                            newContent,
//                            comment_content_element,
//                            editInput,
//                            comment_content,
//                            actionContainer,
//                            saveButton,
//                            cancelButton) {
//     comment_content.textContent = newContent;
//
//     if (newContent.trim() === "") {
//         alert('Vui lòng không để trống bình luận.');
//         return;
//     }
//
//     axios.put('/api/user/video/comment/edit', {commentId: commentId, content: newContent, videoId: videos[currentIndex].id})
//         .then(response => {
//             if (response.data.success) {
//                 comment_content_element.replaceChild(comment_content, editInput);
//                 actionContainer.removeChild(cancelButton);
//                 actionContainer.removeChild(saveButton);
//
//             } else {
//                 alert('Chỉnh sửa bình luận không thành công.');
//             }
//         })
//         .catch(error => {
//             console.error('Error editing the comment:', error);
//             alert('Đã xảy ra lỗi khi chỉnh sửa bình luận.');
//         });
// }
function saveEditedComment(commentId, newContent) {
    if (newContent.trim() === "") {
        alert('Vui lòng không để trống bình luận.');
        return;
    }

    axios.put('/api/user/video/comment/edit', {
        commentId: commentId,
        content: newContent,
        videoId: videos[currentIndex].id
    })
        .then(response => {
            if (response.data.success) {
                // Cập nhật nội dung comment trong dữ liệu local
                let video = videos[currentIndex];
                let cmtIndex = video.comments.findIndex(c => c.id === commentId);
                if (cmtIndex !== -1) {
                    video.comments[cmtIndex].content = newContent;
                }

                // Tìm commentItem trên giao diện
                const commentItem = document.querySelector(`[data-comment-id="${commentId}"]`);
                if (commentItem) {
                    let updatedComment = video.comments[cmtIndex];

                    // Lưu lại vị trí của comment hiện tại
                    let parentUl = commentItem.parentNode;
                    let nextSibling = commentItem.nextSibling;

                    // Xóa comment cũ
                    parentUl.removeChild(commentItem);

                    // Render lại comment mới
                    let newCommentElement = renderComment(updatedComment);

                    // Chèn comment vào vị trí cũ
                    if (nextSibling) {
                        parentUl.insertBefore(newCommentElement, nextSibling);
                    } else {
                        parentUl.appendChild(newCommentElement);
                    }
                }

            } else {
                alert('Chỉnh sửa bình luận không thành công.');
            }
        })
        .catch(error => {
            console.error('Error editing the comment:', error);
            alert('Đã xảy ra lỗi khi chỉnh sửa bình luận.');
        });
}

// function deleteComment(commentId) {
//     const videoId = videos[currentIndex].id;
//
//     axios.post(`${api_video_comment}/delete`, {commentId: commentId, videoId: videoId})
//         .then(response => {
//             if (response.data.success) {
//                 // Xóa bình luận khỏi giao diện
//                 const commentItem = document.querySelector(`[data-comment-id="${commentId}"]`);
//                 if (commentItem) {
//                     commentItem.remove();
//                 }
//
//                 // Cập nhật mảng comments trong videos[currentIndex]
//                 const index = videos[currentIndex].comments.findIndex(comment => comment.id === commentId);
//                 // if (index !== -1) {
//                 //     let cmt = videos[currentIndex].comments[index];
//                 //     // Cập nhật số lượng bình luận hiển thị
//                 //     let cmt_count = document.getElementById('comment-count');
//                 //     cmt_count.innerText = parseInt(cmt_count.innerText) - (cmt.child_count + 1);
//                 //     videos[currentIndex].comments.splice(index, 1);
//                 // }
//                 if (index !== -1) {
//                     let cmt = videos[currentIndex].comments[index];
//                     let cmt_count = document.getElementById('comment-count');
//
//                     // Kiểm tra xem comment này là cha hay con
//                     // Nếu comment là cha (tức không có father_comment_id)
//                     if (!cmt.father_comment_id) {
//                         // Là comment cha
//                         cmt_count.innerText = parseInt(cmt_count.innerText) - (cmt.child_count + 1);
//                     } else {
//                         // Là comment con
//                         cmt_count.innerText = parseInt(cmt_count.innerText) - 1;
//                     }
//
//                     videos[currentIndex].comments.splice(index, 1);
//                 }
//
//
//
//                 alert('Xóa bình luận thành công.');
//             } else {
//                 alert('Xóa bình luận không thành công.');
//             }
//         })
//         .catch(error => {
//             console.error('Error deleting the comment:', error);
//             alert('Đã xảy ra lỗi khi xóa bình luận.');
//         });
// }
function deleteComment(commentId) {
    const videoId = videos[currentIndex].id;

    axios.post(`${api_video_comment}/delete`, {commentId: commentId, videoId: videoId})
        .then(response => {
            if (response.data.success) {
                // Xóa bình luận khỏi giao diện
                const commentItem = document.querySelector(`[data-comment-id="${commentId}"]`);
                if (commentItem) {
                    commentItem.remove();
                }

                // Tìm comment trong videos[currentIndex].comments
                const index = videos[currentIndex].comments.findIndex(comment => comment.id === commentId);
                if (index !== -1) {
                    let cmt = videos[currentIndex].comments[index];

                    // Giảm tổng số comment hiển thị
                    let cmt_count = document.getElementById('comment-count');

                    if (!cmt.father_comment_id) {
                        // Đây là comment cha
                        // Xóa tất cả comment con của nó khỏi mảng videos[currentIndex].comments
                        const grandId = cmt.id;
                        const childComments = videos[currentIndex].comments.filter(c => c.grand_comment_id === grandId);

                        // Xoá các comment con ra khỏi mảng
                        for (let childCmt of childComments) {
                            const childIndex = videos[currentIndex].comments.findIndex(cc => cc.id === childCmt.id);
                            if (childIndex !== -1) {
                                videos[currentIndex].comments.splice(childIndex, 1);
                            }
                        }

                        // Xóa luôn comment cha
                        videos[currentIndex].comments.splice(index, 1);

                        // Cập nhật số comment hiển thị = trừ đi (child_count + 1)
                        cmt_count.innerText = parseInt(cmt_count.innerText) - (cmt.child_count + 1);

                    } else {
                        // Đây là comment con
                        // Xóa comment con khỏi mảng
                        videos[currentIndex].comments.splice(index, 1);

                        // Tìm comment cha để giảm child_count
                        let parentIndex = videos[currentIndex].comments.findIndex(pc => pc.id === cmt.grand_comment_id);
                        if (parentIndex !== -1) {
                            videos[currentIndex].comments[parentIndex].child_count -= 1;
                        }

                        // Giảm total_comments_count đi 1
                        cmt_count.innerText = parseInt(cmt_count.innerText) - 1;

                        // Cập nhật nút "Xem thêm n bình luận" nếu đang hiển thị:
                        const viewRepliesButton = document.querySelector(`[comment-id="${cmt.grand_comment_id}"][data-reply-skip]`);
                        if (viewRepliesButton) {
                            let newChildCount = videos[currentIndex].comments[parentIndex].child_count;
                            if (newChildCount > 0) {
                                viewRepliesButton.innerText = `Xem thêm ${newChildCount} bình luận`;
                            } else {
                                // Nếu không còn comment con, ẩn nút này
                                viewRepliesButton.innerText = '';
                                // Hoặc có thể remove hẳn viewRepliesButton nếu muốn
                            }
                        }
                    }
                }

                alert('Xóa bình luận thành công.');
            } else {
                alert('Xóa bình luận không thành công.');
            }
        })
        .catch(error => {
            console.error('Error deleting the comment:', error);
            alert('Đã xảy ra lỗi khi xóa bình luận.');
        });
}
