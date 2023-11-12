// #region スロット
const slotWrapper = document.getElementById("slotWrapperDiv");
slotWrapper.addEventListener("touchmove", (e) => {
    e.preventDefault();
})

const slot = document.getElementById("slot");
let previousBallId = 0;

function setSlot(ballId) {
    // ボールがない場合はリターン
    if (ballId >= 16) return;

    // フェードイン
    slotWrapper.style.animation = "fadeIn 0.5s forwards";
    slotWrapper.style.display = "block";

    // 0.5秒待ってからアニメーション開始
    setTimeout(() => {
        // 普通の場合
        if (ballId <= 11) {
            // 0.5秒で回転
            slot.animate([
                { transform: `translate(-50%, -50%) rotate(${(ballId - 1) * 30}deg)` },
            ], {
                fill: "forwards",
                duration: 500,
                easing: "ease-in-out",
            })

            // 回転終了後から0.5秒後にフェードアウト
            setTimeout(() => {
                slot.style.transform = `translate(-50%, -50%) rotate(${(ballId - 1) * 30}deg)`;
                slotWrapper.style.animation = "fadeOut 0.5s forwards";
                setTimeout(() => {
                    slotWrapper.style.display = "none";
                }, 500);
            }, 1000);
        }
        // 初めて鬼モードになるとき
        else if (previousBallId <= 11) {
            // 0.25秒Y軸回転
            slotWrapper.animate([
                { transform: `rotateY(0deg)` },
                { transform: `rotateY(90deg)` },
            ], {
                fill: "forwards",
                duration: 500,
                easing: "ease-in-out",
            });

            slot.animate([
                { transform: `translate(-50%, -50%) rotate(${(ballId - 8) * 90}deg)` },
            ], {
                fill: "forwards",
                duration: 1000,
                easing: "ease-in-out",
            })


            // 半回転待ち
            setTimeout(() => {
                // 画像切替
                document.getElementById("ring").style.display = "none";
                document.getElementById("deamonRing").style.display = "block";

                // 0.25秒Y軸回転
                slotWrapper.animate([
                    { transform: `rotateY(90deg)` },
                    { transform: `rotateY(0deg)` },
                ], {
                    fill: "forwards",
                    duration: 500,
                    easing: "ease-in-out",
                });

                // 回転終了後から0.5秒後にフェードアウト
                setTimeout(() => {
                    slot.style.transform = `translate(-50%, -50%) rotate(${(ballId - 8) * 90}deg)`;
                    slotWrapper.style.animation = "fadeOut 0.5s forwards";
                    setTimeout(() => {
                        slotWrapper.style.display = "none";
                    }, 500);
                }, 1500);
            }, 500);
        }
        // 鬼モードを普通に回す
        else {
            // 0.5秒で回転
            slot.animate([
                { transform: `translate(-50%, -50%) rotate(${(ballId - 8) * 90}deg)` },
            ], {
                fill: "forwards",
                duration: 500,
                easing: "ease-in-out",
            })

            // 回転終了後から0.5秒後にフェードアウト
            setTimeout(() => {
                slot.style.transform = `translate(-50%, -50%) rotate(${(ballId - 8) * 90}deg)`;
                slotWrapper.style.animation = "fadeOut 0.5s forwards";
                setTimeout(() => {
                    slotWrapper.style.display = "none";
                }, 500);
            }, 1000);
        }

        previousBallId = ballId;
    }, 500);
}

// ボール辞典
const BallName = ["ビーだま", "スーパーボール", "ピンポンだま", "ゴルフボール", "ビリヤードだま", "テニスボール", "やきゅうボール", "ラグビーボール", "バレーボール", "サッカーボール", "バスケットボール", "???"];
let dictionaryIndex = 1;
function setNextDictionary() {
    dictionaryIndex++;
    if (dictionaryIndex > BallName.length) {
        dictionaryIndex = 1;
    }
    setDictionary();
}
function setPreviousDictionary() {
    dictionaryIndex--;
    if (dictionaryIndex < 1) {
        dictionaryIndex = BallName.length;
    }
    setDictionary();
}
function setDictionary() {
    // ハテナ表示
    if (dictionaryIndex == BallName.length) {
        document.getElementById("dictionaryId").textContent = `No. ??`;
        document.getElementById("dictionaryImg").src = `./img/balls/15.png`;
        document.getElementById("dictionaryH2").textContent = BallName[dictionaryIndex - 1];
    }
    else {
        document.getElementById("dictionaryId").textContent = `No. ${dictionaryIndex}`;
        document.getElementById("dictionaryImg").src = `./img/balls/${dictionaryIndex}.png`;
        document.getElementById("dictionaryH2").textContent = BallName[dictionaryIndex - 1];
    }
}
setDictionary();

// #endregion

// #region バナー
const AdTexts = shuffle([
    "鋭意開発中‼",
    "ブックマークしてね",
    "共有ボタンからホームに追加してね",
    "スーパーボールとピンポン玉は結構跳ねるよ",
    "ビリヤード玉は割と重いよ",
]);
const Banner = document.getElementById("banner");
const BannerContent = document.getElementById("bannerContent");
let adIndex = -1;
function showNextBanner() {
    adIndex = (adIndex + 1) % AdTexts.length;
    BannerContent.textContent = AdTexts[adIndex];
    Banner.style.animation = "";
    Banner.style.animation = "animateBanner 30s linear infinite";
    setTimeout(showNextBanner, 30 * 1000);
}

// 開始5秒後にバナー移動開始
setTimeout(showNextBanner, 5 * 1000);

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}
// #endregion

// #region 花火
function generateConfetti() {
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const Parent = document.getElementById("dialogWrapperDiv");

            const Div = document.createElement("div");
            Parent.appendChild(Div);
            Div.style.position = "absolute";
            Div.style.backgroundColor = "#" + Math.floor(Math.random() * 16777215).toString(16) + "aa";
            Div.style.width = "10px"
            Div.style.height = "20px"
            Div.style.left = `${Math.random() * 100}%`;
            Div.style.pointerEvents = "none";

            let tmpRandom = (Math.random() + Math.random() + Math.random()) / 3 * (Math.random() > 0.5) ? 1 : -1;
            Div.animate([
                { transform: `translateX(0px) rotate(0deg)` },
                { transform: `translateX(${200 * tmpRandom}px) rotate(${-45 * tmpRandom}deg)` },
            ], {
                duration: 1000 + 2000 * Math.random(),
                easing: "ease-in-out",
                iterations: Infinity,
                direction: "alternate",
            });

            Div.style.animation = `fall ${2 + 2 * Math.random()}s linear infinite`;
        }, 100 * i);
    }
}
// #endregion