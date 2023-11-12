const AudioImg = document.getElementById("audioImg");

const BGM = new Audio();
BGM.src = `./bgm/${Math.floor(Math.random() * 3) + 1}.mp3`;
BGM.loop = true;

const BallSound = new Audio();
BallSound.src = `./se/${Math.floor(Math.random() * 4)}.mp3`;

let volume = Number(localStorage.getItem("volume")) + 0;

function audioPressed() {
    // スマホチェック
    if (navigator.userAgent.match(/(iPhone|iPad|iPod|Android)/i)) {
        volume = !volume * 3;
    }
    // それ以外
    else {
        volume = (volume + 1) % 4;
    }

    setImgSrc();
}

function setImgSrc() {
    AudioImg.src = `./img/speaker/${volume}.png`;
    BGM.volume = volume / 3;
    BallSound.volume = volume / 3;
    localStorage.setItem("volume", volume);
}
setImgSrc();

function startBgm() {
    if (volume == 0) {
        return;
    }

    BGM.volume = volume / 3;
    BGM.play();
}

function playBallSound() {
    if (volume == 0) {
        return;
    }

    BallSound.pause();
    BallSound.currentTime = 0;
    BallSound.play();
}