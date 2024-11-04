//Thông tin mô tả
// Gắn sự kiện click cho nút "Thông tin mô tả"
document.getElementById('info-button-modal').addEventListener('click', function (event) {
    event.preventDefault(); // Ngăn chặn hành động mặc định của thẻ <a>
    toggleDescription();
});

// Gắn sự kiện click cho nút "X" để đóng phần mô tả
document.getElementById('close-description').addEventListener('click', function () {
    const descriptionSection = document.getElementById('description-section');
    descriptionSection.classList.remove('d-block');
    descriptionSection.classList.add('d-none');
});

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Chia sẻ
// Gắn sự kiện cho nút chia sẻ
document.getElementById('shareModal').addEventListener('shown.bs.modal', function () {
    document.getElementById('share-link').value = window.location.href;
});
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Gắn sự kiện click cho nút bình luận
document.getElementById('comment-button').addEventListener('click', function (event) {
    event.preventDefault(); // Ngăn chặn hành động mặc định nếu có
    toggleComment();
});
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Lưu vào danh sách phát
// Sự kiện cho nút "Lưu vào danh sách phát"
// document.getElementById('save-to-playlist-button').addEventListener('click', function (event) {
//     event.preventDefault(); // Ngăn chặn hành động mặc định
//
//     const settingsModalEl = document.getElementById('settingsModal');
//     settingsModalEl.addEventListener('hidden.bs.modal', function () {
//         const saveToPlaylistModal = new bootstrap.Modal(document.getElementById('saveToPlaylistModal'));
//         saveToPlaylistModal.show();
//     }, {once: true});
//     // Đóng modal "Cài đặt"
//     let settingsModal = bootstrap.Modal.getInstance(document.getElementById('settingsModal'));
//     settingsModal.hide();
//
//     // Mở modal "Lưu vào danh sách phát" sau khi modal "Cài đặt" đã đóng
//     settingsModal._element.addEventListener('hidden.bs.modal', function () {
//         let saveToPlaylistModal = new bootstrap.Modal(document.getElementById('saveToPlaylistModal'));
//         saveToPlaylistModal.show();
//     }, {once: true});
// });

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Phụ đề
// Gắn sự kiện click cho nút "Phụ đề"
document.getElementById('subtitle-button').addEventListener('click', function () {
    // Đóng modal "Cài đặt" sau khi nhấn
    let settingsModal = bootstrap.Modal.getInstance(document.getElementById('settingsModal'));
    settingsModal.hide();

    // Hiển thị modal thông báo
    let subtitleModal = new bootstrap.Modal(document.getElementById('subtitleModal'));
    subtitleModal.show();
});

document.getElementById('submitReportButton').addEventListener('click', function () {
    // Lấy lý do vi phạm đã chọn
    const selectedReason = document.querySelector('input[name="violationReason"]:checked');
    if (selectedReason) {
        // Hiển thị thông báo xác nhận
        document.getElementById('reportConfirmation').classList.remove('d-none');
        document.getElementById('reportConfirmation').classList.add('d-block');
        document.getElementById('selectedReason').innerText = selectedReason.value;

        // Ẩn form lựa chọn lý do vi phạm
        document.getElementById('reportForm').querySelectorAll('div.mb-3')[0].classList.add('d-none');

        // Ẩn nút "Báo vi phạm" và "Huỷ"
        document.querySelector('#reportModal .modal-footer').classList.add('d-none');

    } else {
        alert('Vui lòng chọn một lý do vi phạm.');
    }
});
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Báo vi phạm
// Khi modal "Báo vi phạm" bị ẩn, đặt lại trạng thái
document.getElementById('reportModal').addEventListener('hidden.bs.modal', function () {
    // Đặt lại form
    document.getElementById('reportForm').reset();
    // Hiển thị lại form lựa chọn lý do vi phạm
    document.getElementById('reportForm').querySelectorAll('div.mb-3')[0].classList.remove('d-none');
    // Ẩn phần xác nhận
    document.getElementById('reportConfirmation').classList.remove('d-block');
    document.getElementById('reportConfirmation').classList.add('d-none');
    // Hiển thị lại footer
    document.querySelector('#reportModal .modal-footer').classList.remove('d-none');
});

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Gửi ý kiến phản hồi
document.getElementById('feedback-button').addEventListener('click', function () {
    // Hiển thị bảng phản hồi
    document.getElementById('feedback-section').classList.remove('d-none');
    document.getElementById('feedback-section').classList.add('d-block');

    // Đóng modal "Cài đặt" sau khi nhấn
    let settingsModal = bootstrap.Modal.getInstance(document.getElementById('settingsModal'));
    settingsModal.hide();
});

document.getElementById('close-feedback').addEventListener('click', function () {
    // Ẩn bảng phản hồi
    document.getElementById('feedback-section').classList.remove('d-block');
    document.getElementById('feedback-section').classList.add('d-none');

    // Đặt lại nội dung
    resetFeedbackForm();
});

document.getElementById('send-feedback-button').addEventListener('click', function () {
    const feedbackText = document.getElementById('feedback-text').value.trim();

    if (feedbackText) {
        // Hiển thị thông báo cảm ơn
        document.getElementById('feedback-thank-you').classList.remove('d-none');

        // Ẩn các thành phần khác
        document.getElementById('feedback-text').disabled = true;
        document.getElementById('screenshot-button').disabled = true;
        document.getElementById('send-feedback-button').disabled = true;

    } else {
        alert('Vui lòng nhập nội dung phản hồi.');
    }
});

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Nút điều hướng
// Event listeners for navigation buttons
document.getElementById('prev-button').addEventListener('click', function () {
    if (currentIndex > 0) {
        currentIndex -= 1;
        loadVideo(currentIndex);
    }
});

document.getElementById('next-button').addEventListener('click', function () {
    if (currentIndex < videos.length - 1) {
        currentIndex += 1;
        loadVideo(currentIndex);
    }
});

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Nút dislike
// Gán sự kiện cho button dislike
document.getElementById('dislike-button').addEventListener('click', function () {
    alert('Dislike functionality not implemented yet');
});

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Chức năng chụp màn hình
// Gán sự kiện cho button chụp màn hình
document.getElementById('screenshot-button').addEventListener('click', function () {
    html2canvas(document.body).then(function (canvas) {
        // Chuyển đổi canvas thành hình ảnh dạng data URL
        const imgData = canvas.toDataURL('image/png');

        // Lưu trữ hoặc gửi hình ảnh này đến server nếu cần
        // Ví dụ: hiển thị hình ảnh trong bảng phản hồi
        const imgPreview = document.createElement('img');
        imgPreview.src = imgData;
        imgPreview.classList.add('img-fluid', 'mt-2');
        document.getElementById('feedback-section').appendChild(imgPreview);
    });
});

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Chức năng tạo playlist
//Tạo sự kiện chức năng tạo playlist và danh sách phát
document.getElementById('playlist1Privacy').addEventListener('click', function () {
    togglePrivacy(this);
});
document.getElementById('playlist2Privacy').addEventListener('click', function () {
    togglePrivacy(this);
});
document.getElementById('playlist3Privacy').addEventListener('click', function () {
    togglePrivacy(this);
});

document.getElementById('addNewPlaylist').addEventListener('click', function () {
    // Show the "Create New Playlist" modal when the "+ Danh sách phát mới" button is clicked
    let createPlaylistModal = new bootstrap.Modal(document.getElementById('createPlaylistModal'));
    createPlaylistModal.show();
});

document.getElementById('createPlaylistButton').addEventListener('click', function () {
    // Handle the logic to create the playlist when the "Tạo" button is clicked
    const playlistTitle = document.getElementById('playlistTitle').value;
    const privacySetting = document.getElementById('privacySelect').value;

    if (playlistTitle.trim() === "") {
        alert("Vui lòng nhập tiêu đề cho danh sách phát");
        return;
    }

    // Gửi thông tin playlist tới server để lưu
    axios.post('/api/playlist/create', {
        title: playlistTitle,
        privacy: privacySetting
    })
        .then(response => {
            // console.log("Playlist created successfully:", response.data);
            // Đóng modal sau khi tạo thành công
            var createPlaylistModal = new bootstrap.Modal(document.getElementById('createPlaylistModal'));
            createPlaylistModal.hide();
        })
        .catch(error => {
            console.error('Error creating playlist:', error);
        });
});
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Chức năng không đề xuất kênh này
// Event listener for "Không đề xuất kênh này"
// document.getElementById('no-suggest-channel').addEventListener('click', function () {
//     event.preventDefault(); // Ngăn chặn hành động mặc định của thẻ <a>
//     // Đóng modal cài đặt
//     let settingsModal = bootstrap.Modal.getInstance(document.getElementById('settingsModal'));
//     settingsModal.hide();
//
//     // Xử lý khi click vào "Không đề xuất kênh này"
//     if (currentIndex < videos.length - 1) {
//         currentIndex += 1;
//         loadVideo(currentIndex);  // Gọi hàm để load video kế tiếp
//         // Cuộn tới video kế tiếp
//         const videoSection = document.getElementById('video-player').parentElement;
//         videoSection.scrollIntoView({behavior: 'smooth', block: 'center'});
//     } else {
//         alert('Không có video tiếp theo.');
//     }
// });
// Event listener for "Không đề xuất kênh này"
// Event listener for "Không đề xuất kênh này"
document.getElementById('no-suggest-channel').addEventListener('click', function (event) {
    event.preventDefault(); // Ngăn chặn hành động mặc định của thẻ <a>
    console.log('"Không đề xuất kênh này" đã được nhấp.');

    // Đóng modal "Cài đặt"
    let settingsModalElement = document.getElementById('settingsModal');
    let settingsModal = bootstrap.Modal.getInstance(settingsModalElement);
    if (!settingsModal) {
        console.log('Không tìm thấy instance của settingsModal, khởi tạo mới.');
        settingsModal = new bootstrap.Modal(settingsModalElement);
    }
    settingsModal.hide();
    console.log('Đã gọi hide() trên settingsModal.');

    // Lắng nghe sự kiện khi modal đã đóng hoàn toàn
    const onHidden = () => {
        console.log('settingsModal đã được đóng.');
        if (currentIndex < videos.length - 1) {
            currentIndex += 1;
            console.log('Tăng currentIndex lên:', currentIndex);
            loadVideo(currentIndex);  // Gọi hàm để load video kế tiếp

            // Cuộn tới video kế tiếp
            const videoSection = document.getElementById('video-player').parentElement;
            videoSection.scrollIntoView({behavior: 'smooth', block: 'center'});
            console.log('Đã cuộn tới video tiếp theo.');
        } else {
            alert('Không có video tiếp theo.');
            console.log('currentIndex đã đạt đến cuối danh sách videos.');
        }
        // Loại bỏ sự kiện sau khi đã thực hiện
        settingsModalElement.removeEventListener('hidden.bs.modal', onHidden);
    };

    settingsModalElement.addEventListener('hidden.bs.modal', onHidden, { once: true });
    console.log('Đã thêm sự kiện "hidden.bs.modal" để gọi onHidden.');
});



document.getElementById('copy-button').addEventListener('click', function () {
    const shareLinkInput = document.getElementById('share-link');
    shareLinkInput.select();
    shareLinkInput.setSelectionRange(0, 99999); // Đối với các thiết bị di động
    document.execCommand('copy');

    alert('Đường link đã được sao chép: ' + shareLinkInput.value);
});

document.getElementById('prev-icon').addEventListener('click', function () {
    const container = document.getElementById('social-icons');
    container.scrollBy({
        left: -100,  // Trượt sang trái 100px
        behavior: 'smooth'
    });
});

document.getElementById('next-icon').addEventListener('click', function () {
    const container = document.getElementById('social-icons');
    container.scrollBy({
        left: 100,  // Trượt sang phải 100px
        behavior: 'smooth'
    });
});

// Function to open Share Modal
function openShareModal() {
    var shareModal = new bootstrap.Modal(document.getElementById('shareModal'));
    shareModal.show();
}

// Function to open Settings Modal
function openSettingsModal() {
    var settingsModal = new bootstrap.Modal(document.getElementById('settingsModal'));
    settingsModal.show();
}

// Function to open Login Modal
function openLoginModal() {
    var loginModal = new bootstrap.Modal(document.getElementById('login-popup'));
    loginModal.show();
}
// Các hàm mở modal đã được định nghĩa ở trên
// Khởi tạo Bootstrap Tooltips
document.addEventListener('DOMContentLoaded', function () {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl, {
            placement: 'left', // Đặt vị trí tooltip bên trái
            trigger: 'hover',  // Hiển thị tooltip khi rê chuột
            container: 'body'  // Đảm bảo Tooltip được thêm vào body
        });
    });
});


