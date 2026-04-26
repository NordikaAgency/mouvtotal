const videoPlayer = document.getElementById('myHeroVideo');

const playlist = [
    "../media/hero-video.mp4",
    "../media/hero-video2.mp4",
    "../media/hero-video3.mp4"
];

let currentVideoIndex = 0;

videoPlayer.onended = function() {
    currentVideoIndex = (currentVideoIndex + 1) % playlist.length;
    
    videoPlayer.src = playlist[currentVideoIndex];
    
    videoPlayer.play();
};