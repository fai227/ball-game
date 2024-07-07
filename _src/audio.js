const AudioImg = document.getElementById("audioImg");
AudioImg.addEventListener("click", audioPressed);

const BGM = new Audio(`./bgm/${Math.floor(Math.random() * 5) + 1}.mp3`);
BGM.loop = true;

const BallSound = new Audio(`./se/ball.mp3`);
const FanfareSound = new Audio(`./se/fanfare.mp3`);
const GameOver = new Audio(`./se/gameover.mp3`);

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

    const calculatedVolume = (volume / 3) * (volume / 3);
    BGM.volume = calculatedVolume;
    BallSound.volume = calculatedVolume;
    FanfareSound.volume = calculatedVolume;
    GameOver.volume = calculatedVolume;

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

function playFanfareSound() {
    if (volume == 0) {
        return;
    }

    FanfareSound.play();
}

function playGameOverSound() {
    if (volume == 0) {
        return;
    }

    GameOver.play();
}