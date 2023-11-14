const AudioImg = document.getElementById("audioImg");
AudioImg.addEventListener("click", audioPressed);

const BGM = new Audio(`./bgm/${Math.floor(Math.random() * 3) + 1}.mp3`);
BGM.loop = true;

const BallSound = new Audio(`./se/2.mp3`);
const Fanfare = new Audio(`./se/fanfare.mp3`);
const isSmartPhone = navigator.userAgent.match(/(iPhone|iPad|iPod|Android)/i);

let volume = Number(localStorage.getItem("volume")) + 0;

function audioPressed() {
    // スマホチェック
    if (isSmartPhone) {
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
    BGM.volume = (volume / 3) * (volume / 3);
    BallSound.volume = (volume / 3) * (volume / 3);
    Fanfare.volume = (volume / 3) * (volume / 3);
    localStorage.setItem("volume", volume);
}
setImgSrc();

function startBgm() {
    if (volume == 0) {
        return;
    }

    BGM.play();
}

function playBallSound() {
    if (volume == 0) {
        return;
    }

    // スマホは効果音を再生しない
    if (isSmartPhone) {
        return;
    }

    BallSound.pause();
    BallSound.currentTime = 0;
    BallSound.play();
}

function playFanfare() {
    if (volume == 0) {
        return;
    }

    Fanfare.play();
}