// #region スロット
const slotWrapper = document.getElementById("slotWrapperDiv");
slotWrapper.addEventListener("touchmove", (e) => {
    e.preventDefault();
})

const slot = document.getElementById("slot");
let previousBallId = 0;
let slotMoving = false;

function setSlot(ballId) {
    // ボールがない場合はリターン
    if (ballId >= 16) return;

    // フラグをオン
    slotMoving = true;

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
                    slotMoving = false;
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
                { transform: `translate(-50%, -50%) rotate(${(ballId - 8) * 90 + 30}deg)` },
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
                        slotMoving = false;
                    }, 500);
                }, 1500);
            }, 500);
        }
        // 鬼モードを普通に回す
        else {
            // 0.5秒で回転
            slot.animate([
                { transform: `translate(-50%, -50%) rotate(${(ballId - 8) * 90 + 30}deg)` },
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
                    slotMoving = false;
                }, 500);
            }, 1000);
        }

        previousBallId = ballId;
    }, 500);
}

function hideSlot() {
    if (slotMoving) return;

    slotWrapper.style.display = "none";
    slotWrapper.style.opacity = "0";
}

function showSlot() {
    if (slotMoving) return;

    slotWrapper.style.animation = "fadeIn 0s forwards";
    slotWrapper.style.display = "block";
    slotWrapper.style.opacity = "1";
}
// #endregion

// #region ボール辞典
document.getElementById("previousDictionary").addEventListener("click", setPreviousDictionary);
document.getElementById("nextDictionary").addEventListener("click", setNextDictionary);

// ボール辞典
const BallName = [
    "ビーだま",
    "スーパーボール",
    "ピンポンだま",
    "ゴルフボール",
    "ビリヤードだま",
    "テニスボール",
    "やきゅうボール",
    "アメフトボール",
    "バレーボール",
    "サッカーボール",
    "バスケットボール",

    "スーパーボール",
    "ビリヤードだま",
    "アメフトボール",
    "バスケットボール",
];
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
    document.getElementById("dictionaryId").textContent = dictionaryIndex <= 11 ? `No. ${dictionaryIndex}` : `No. ${dictionaryIndex - 11} (おに)`;
    document.getElementById("dictionaryImg").src = `./img/balls/${dictionaryIndex}.png`;
    document.getElementById("dictionaryH2").textContent = BallName[dictionaryIndex - 1];

}
setDictionary();
// #endregion

// #region バナー
const AdTexts = shuffle([
    "ランキングで1位を目指そう！",
    "ブックマークしてね",
    "どんどん友達にシェアしてね",
    "共有ボタンからホームに追加するとアプリのように使えるよ",

    "スーパーボールとピンポンだまは結構跳ねるよ",
    "ビリヤードだまは割と重いよ",
    "まずはバスケットボールを作ろう！",
    "慣れてきたら、バスケットボールを２こ作れるかな...？",
]);

const DevelopTips = shuffle([
    "初めての物理演算、実装結構大変やったよ",
    "MatterJSというライブラリを使っています",

    "アメフトボール型の形を作るのがちょっと大変だったよ",
    "パソコンで開くと、効果音がなるよ",
    "テニスボール以上を作ると、オートセーブされるよ。ページをリロードしても安心！",
    "BGMは3種類あるよ",

    "構想から開発完成まで大体1ヶ月ぐらいかかったよ",
    "他の作品も遊んでみてね～！詳しくはサイト一番下のボタンからホームに戻ってね！",
]);

const IllustTips = shuffle([
    "ビーだまは一番小さいけど、実は一番使っている色の数が多い！",
    "スーパーボールは「らしさ」を出すのに苦労…白いマーブルが良く映えるね",
    "ピンポンだまの目の星は高級さを表す指標のアレ。大会とかでは3つ星を使うらしい。",
    "ピンポンだま、肥えろ跳ねるな",
    "ゴルフボールはおヒゲがチャーミング！デコボコの影も合わさって最強に見える",
    "ビリヤードだまはデザインに超四苦八苦…。結果的には無機質なお顔が超GOOD！",
    "テニスボールはボールゲームの顔であり一番最初に描かれたボール！実は縁取りがほんの少しもこもこしてる！",
    "初期では、やきゅうボールは縫い目を傷に見立てた隻眼となってたぞ！グッドデザイン賞受賞！",
    "アメフトボールは縫い目が口に…！？何か頬張っているような表情がとても好きです",
    "バレーボールは模様と顔がどっちも映えるような色使い！顔は少女漫画のマスコット的なかわいさに！",
    "サッカーボール、実は真っ黒じゃなくて少し青色がかった色を使っているぞ！",
    "バスケットボールは「モッ」とした口がミソ。ゲーム中に見る機会が少ないのがかなしいね",
]);

const Banner = document.getElementById("banner");
const BannerContent = document.getElementById("bannerContent");
let adIndex = -1;
let developIndex = -1;
let illustIndex = -1;
function showNextBanner() {
    // バナーの内容を変更
    const randNum = Math.random();

    // 50%の確率で広告を表示
    if (randNum < 0.5) {
        adIndex = (adIndex + 1) % AdTexts.length;
        BannerContent.textContent = AdTexts[adIndex];
    }
    // 25%の確率で開発秘話を表示
    else if (randNum < 0.75) {
        developIndex = (developIndex + 1) % DevelopTips.length;
        BannerContent.textContent = DevelopTips[developIndex];
    }
    // 25%の確率でイラストの秘話を表示
    else {
        illustIndex = (illustIndex + 1) % IllustTips.length;
        BannerContent.textContent = IllustTips[illustIndex];
    }

    const BannerTime = BannerContent.textContent.length * 1000;

    // バナーを右から左に移動
    Banner.animate([
        { transform: `translateX(${Banner.parentElement.clientWidth}px)` },
        { transform: `translateX(-${Banner.clientWidth}px)` },
    ], {
        duration: BannerTime,
        easing: "linear",
        fill: "forwards",
    });

    // アニメーション終了後3秒後に次のバナーを表示
    setTimeout(showNextBanner, BannerTime + 3000);
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