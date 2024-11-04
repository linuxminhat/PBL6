function loadVideo(index) {
    if (index >= 0 && index < videos.length) {
        const video = videos[index];
        const videoPlayer = document.getElementById('video-player');

        // Xóa sự kiện timeupdate cũ nếu có
        videoPlayer.removeEventListener('timeupdate', updateLyrics);

        // Cập nhật nguồn video
        videoPlayer.src = video.video_url;

        // Đảm bảo video được tải lại
        videoPlayer.load();

        // Cập nhật số lượt thích và bình luận
        document.getElementById('like-count').innerText = video.like_count;
        document.getElementById('comment-count').innerText = video.total_comments_count;

        // Hiển thị bình luận
        renderCommentsForVideo(video);

        // Cập nhật trạng thái liked và thay đổi màu nút like
        liked = video.liked;
        const likeButton = document.getElementById('like-button');
        if (liked) {
            likeButton.style.backgroundColor = 'black';
            likeButton.style.color = 'white';
        } else {
            likeButton.style.backgroundColor = 'white';
            likeButton.style.color = 'black';
        }

        // Cập nhật thông tin hiển thị trên video
        let video_context = document.getElementById('video-context')
        let video_music_name = video.music.name
        let artist_name = ''
        if (video.music.artists.length === 0) {
            artist_name = 'Unknown Artist'
        }
        for (let i = 0; i < video.music.artists.length; i++) {
            if (i == video.music.artists.length - 1) {
                artist_name += `${video.music.artists[i].name} `
            }
            else{
                artist_name += `${video.music.artists[i].name},`
            }
        }
        let context = `Now playing:  ${video_music_name} by ${artist_name}`

        document.getElementById('video-title').innerText = video.title || 'Không có tiêu đề';
        document.getElementById('uploader').innerText = video.user ? video.user.name : 'Không rõ';
        document.getElementById('video-music').innerText = video.music ? video.music.name : 'Không có bài hát';
        document.getElementById('video-created-at').innerText = formatDateRelative(video.created_at);
        document.getElementById('video-music-title').innerText = video_music_name;
        document.getElementById('video-music-thumbnail_url').src = video.music.thumbnail_url;

        video_context.setAttribute('aria-label', context);


        // Cập nhật số lượt thích và bình luận trong overlay nếu cần
        document.getElementById('like-count-description').innerText = video.like_count;
        document.getElementById('comment-count-description').innerText = video.comments.length;
        document.getElementById('comment-count-description').innerText = videos[currentIndex].comments.length;

        // Lưu lyrics vào biến toàn cục
        lyrics = video.music.lyrics;

        musicStart = video.music_start || 0;

        // Khởi tạo hiển thị lyrics
        initLyrics();
    }
}


// // Fetch the list of videos from the API using Axios
function fetchVideos() {
    axios.post(`${api_video}/get`, {userId: sessionUser.id})
        .then(response => {
            videos = response.data;
            // console.log(videos)
            if (videos.length > 0) {
                loadVideo(0);  // Load the first video initially
            }
        })
        .catch(error => {
            console.error('Error fetching videos:', error);
        });
}

// Gọi hàm fetchVideos khi trang được load
document.addEventListener('DOMContentLoaded', function () {
    // Gọi dữ liệu video
    fetchVideos();
});

// Hàm định dạng thời gian từ ISO string sang định dạng mong muốn
function formatDateRelative(isoString) {
    const now = new Date();
    const date = new Date(isoString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    const intervals = [
        { label: 'năm', seconds: 31536000 },
        { label: 'tháng', seconds: 2592000 },
        { label: 'tuần', seconds: 604800 },
        { label: 'ngày', seconds: 86400 },
        { label: 'giờ', seconds: 3600 },
        { label: 'phút', seconds: 60 },
        { label: 'giây', seconds: 1 }
    ];

    for (const interval of intervals) {
        const count = Math.floor(diffInSeconds / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.label} trước`;
        }
    }
    return 'Vừa xong';
}


function flattenLyrics(lyrics) {
    return lyrics.flat();
}

function initLyrics() {
    if (!lyrics || lyrics.length === 0) {
        document.getElementById('lyric-line-1').innerHTML = '';
        document.getElementById('lyric-line-2').innerHTML = '';
        return;
    }

    // Initialize lines directly from lyrics
    lines = lyrics.map(lineWords => {
        const words = lineWords;
        const start_time = words[0].start_time;
        const end_time = words[words.length - 1].end_time;
        return { words: words, start_time: start_time, end_time: end_time };
    });

    // Initialize the current line index
    currentLineIndex = 0;

    // Start listening to the timeupdate event
    const videoPlayer = document.getElementById('video-player');
    videoPlayer.addEventListener('timeupdate', updateLyrics);
}

function updateLyrics() {
    const videoPlayer = document.getElementById('video-player');
    let currentTime = videoPlayer.currentTime * 1000; // Convert to milliseconds
    let currentTimeAdjusted = currentTime + musicStart;

    if (currentTimeAdjusted < 0) {
        document.getElementById('lyric-line-1').innerHTML = '';
        document.getElementById('lyric-line-2').innerHTML = '';
        return;
    }

    // Xác định lại currentLineIndex dựa trên currentTimeAdjusted
    // lines được giả sử đã sắp xếp theo start_time
    let newIndex = 0;
    for (let i = 0; i < lines.length; i++) {
        // Nếu là dòng cuối hoặc thời gian hiện tại nhỏ hơn start_time của dòng kế tiếp
        if (i === lines.length - 1 || currentTimeAdjusted < lines[i+1].start_time) {
            newIndex = i;
            break;
        }
    }

    currentLineIndex = newIndex;

    const currentLine = lines[currentLineIndex];
    const nextLine = lines[currentLineIndex + 1];

    if (currentLine) {
        displayLineWithHighlight(currentLine, 'lyric-line-1', currentTimeAdjusted);
    } else {
        document.getElementById('lyric-line-1').innerHTML = '';
    }

    if (nextLine) {
        displayLineWithHighlight(nextLine, 'lyric-line-2', currentTimeAdjusted);
    } else {
        document.getElementById('lyric-line-2').innerHTML = '';
    }
}




function getCurrentLineWords() {
    // Lấy các từ trong khoảng thời gian xung quanh từ hiện tại
    const lineWords = [];

    // Giả sử mỗi câu có tối đa 10 từ trước và sau từ hiện tại
    const startIndex = Math.max(0, currentWordIndex - 5);
    const endIndex = Math.min(flatLyrics.length - 1, currentWordIndex + 5);

    for (let i = startIndex; i <= endIndex; i++) {
        lineWords.push(flatLyrics[i]);
    }

    return lineWords;
}
// Hàm displayCurrentWord
function displayCurrentWord(word) {
    const lyricsOverlay = document.getElementById('lyrics-overlay');

    // Lấy các từ trong câu hiện tại
    const lineWords = getCurrentLineWords();

    // Tạo chuỗi HTML cho toàn bộ câu
    let lineHtml = '';
    for (let i = 0; i < lineWords.length; i++) {
        const w = lineWords[i];
        const wordIndex = Math.max(0, currentWordIndex - 5) + i;
        if (wordIndex === currentWordIndex) {
            // Tô màu từ hiện tại
            lineHtml += `<span style="color: yellow;">${w.word} </span>`;
        } else {
            // Các từ khác
            lineHtml += `${w.word} `;
        }
    }

    // Hiển thị câu
    lyricsOverlay.innerHTML = lineHtml.trim();
}
function displayLine(line, elementId) {
    const lineElement = document.getElementById(elementId);

    // Tạo nội dung câu với icon âm nhạc
    let lineHtml = '';
    if (elementId === 'lyric-line-1') {
        // Dòng 1: Thêm icon âm nhạc ở đầu
        lineHtml += '<i class="bi bi-music-note-beamed"></i> ';
    }

    lineHtml += line.words.join(' ');

    if (elementId === 'lyric-line-2') {
        // Dòng 2: Thêm icon âm nhạc ở cuối
        lineHtml += ' <i class="bi bi-music-note-beamed"></i>';
    }

    lineElement.innerHTML = lineHtml;
}

function displayLineWithHighlight(line, elementId, currentTimeAdjusted) {
    const lineElement = document.getElementById(elementId);

    let lineHtml = '';

    // Thêm icon âm nhạc nếu cần
    if (elementId === 'lyric-line-1') {
        lineHtml += '<i class="bi bi-music-note-beamed"></i> ';
    }

    // Duyệt qua các từ trong câu
    for (let i = 0; i < line.words.length; i++) {
        const word = line.words[i];
        let wordHtml = '';
        let wordText = word.word;

        // Viết hoa chữ cái đầu tiên của câu
        if (i === 0) {
            wordText = wordText.charAt(0).toUpperCase() + wordText.slice(1);
        }

        // Kiểm tra nếu từ đã hát hoặc đang hát
        if (currentTimeAdjusted >= word.start_time) {
            // Áp dụng lớp CSS để tô màu từ đã hát hoặc đang hát
            wordHtml = `<span class="current-word">${wordText}</span>`;
        } else {
            // Các từ chưa hát
            wordHtml = `<span>${wordText}</span>`;
        }

        lineHtml += wordHtml + ' '; // Thêm khoảng trắng giữa các từ
    }

    // Thêm icon âm nhạc ở cuối nếu cần
    if (elementId === 'lyric-line-2') {
        lineHtml += '<i class="bi bi-music-note-beamed"></i>';
    }

    lineElement.innerHTML = lineHtml.trim();
}

const thumbnail = document.querySelector('.cd-thumbnail');
const videoPlayer = document.getElementById('video-player');

// Thêm sự kiện để kiểm soát hiệu ứng
videoPlayer.addEventListener('play', () => {
    thumbnail.style.animationPlayState = 'running';
});

videoPlayer.addEventListener('pause', () => {
    thumbnail.style.animationPlayState = 'paused';
});


