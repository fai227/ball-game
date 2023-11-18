/// <reference path="matter.js"/>

// インポート
const Engine = Matter.Engine;
const Render = Matter.Render;
const Runner = Matter.Runner;
const Body = Matter.Body;
const Bodies = Matter.Bodies;
const Composite = Matter.Composite;
const Events = Matter.Events;

const StartGameButton = document.getElementById("startGameButton");
StartGameButton.onclick = startGameButtonPressed;
const RankingButton = document.getElementById("rankingButton");
RankingButton.onclick = rankingButtonPressed;
const HowToPlayButton = document.getElementById("howToPlayButton");
HowToPlayButton.onclick = howToPlayButtonPressed;

// 定数設定
const bubbleImage = new Image(); bubbleImage.src = "./img/bubble.png";
const CraneImage = new Image(); CraneImage.src = "./img/crane.png";
const OpenCraneImage = new Image(); OpenCraneImage.src = "./img/openCrane.png";
const BallSize = [65, 90, 130, 150, 190, 240, 285, 350, 390, 490, 590, 90, 150, 240, 350];
const BallScore = [0, 1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78, 91, 105, 120];
let GameDataScore = 0;
let GameDataBall = 1;
let GameDataNext = 1;
const Placeholder = { x: 540, ball: undefined };

// 環境設定
const engine = Engine.create();
engine.gravity.scale = 0.003;
const render = Render.create({
    canvas: document.getElementById("canvas"),
    engine: engine,
    options: {
        width: 1080,
        height: 1980,
        wireframes: false,
        // showDebug: true,
        background: 'transparent',
        wireframeBackground: 'black'
    },
});

// Preload
const BallImages = [];
for (let i = 1; i <= BallSize.length; i++) {
    const tmpImage = new Image();
    tmpImage.src = `./img/balls/${i}.png`;
    BallImages.push(tmpImage)
    render.textures[`./img/balls/${i}.png`] = tmpImage;
}
const overlayImage = new Image();
overlayImage.src = "./img/balls/overlay.png";
render.textures["./img/balls/overlay.png"] = overlayImage;
const overlay8Image = new Image();
overlay8Image.src = "./img/balls/overlay8.png";
render.textures["./img/balls/overlay8.png"] = overlay8Image;

// 描画開始
Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);

function setPlatform() {
    // 初期設定
    const bottomPlatform = Bodies.rectangle(540, 1980 - 25 / 2, 1080, 25, {
        render: {
            sprite: { texture: "./img/horizontalBorder.png" }
        }
    });
    Body.setStatic(bottomPlatform, true);
    Composite.add(engine.world, bottomPlatform);

    const bottomTransparentPlatform = Bodies.rectangle(540, 2180, 1080, 450, {
        render: {
            fillStyle: "#00000000",
        }
    });
    Body.setStatic(bottomTransparentPlatform, true);
    Composite.add(engine.world, bottomTransparentPlatform);

    const dangerLine = Bodies.rectangle(540, 1980 - 1321 - 25 / 2, 1080, 25, {
        render: {
            fillStyle: "#ff000055",
        }
    });
    dangerLine.isSensor = true;
    dangerLine.tag = "dangerLine";
    Body.setStatic(dangerLine, true);
    Composite.add(engine.world, dangerLine);

    const leftPlatform = Bodies.rectangle(25 / 2, 1980 - 1321 / 2, 25, 1321, {
        render: {
            sprite: { texture: "./img/verticalBorder.png" }
        }
    });
    Body.setStatic(leftPlatform, true);
    Composite.add(engine.world, leftPlatform);

    const rightPlatform = Bodies.rectangle(1080 - 25 / 2, 1980 - 1321 / 2, 25, 1321, {
        render: {
            sprite: { texture: "./img/verticalBorder.png" }
        }
    });
    Body.setStatic(rightPlatform, true);
    Composite.add(engine.world, rightPlatform);
}
setPlatform();

// 物理演算イベント
let previous = 0;
Events.on(render, "afterRender", () => {
    // 初期設定
    const context = render.context;
    context.fillStyle = "white";
    context.strokeStyle = "#7a5829";
    context.lineWidth = 8;
    context.textAlign = "center";
    render.context.font = Math.round(render.canvas.width * 0.08) + "px 'HeaderFont'";

    // 開いているクレーン表示
    if (Placeholder.ball == undefined) {
        context.drawImage(OpenCraneImage, Placeholder.x - OpenCraneImage.width / 4, 510 - OpenCraneImage.height / 2, OpenCraneImage.width / 2, OpenCraneImage.height / 2);
    }
    // 閉まっているクレーン表示
    else {
        context.drawImage(CraneImage, Placeholder.x - CraneImage.width / 4, 510 - CraneImage.height / 2, CraneImage.width / 2, CraneImage.height / 2);
    }

    // スコア表示
    context.drawImage(bubbleImage, 100, 50, 300, 300);
    context.fillText("スコア", 250, 80);
    context.strokeText("スコア", 250, 80);
    context.fillText(GameDataScore, 250, 230, 250);
    context.strokeText(GameDataScore, 250, 230, 250);

    // ネクスト表示
    context.drawImage(bubbleImage, 680, 50, 300, 300);
    context.fillText("ネクスト", 830, 80);
    context.strokeText("ネクスト", 830, 80);
    const nextBallWidth = BallSize[GameDataNext - 1];
    context.drawImage(BallImages[GameDataNext - 1], 830 - nextBallWidth / 2, 205 - nextBallWidth / 2, nextBallWidth, nextBallWidth);

    // プレースホルダーを表示
    if (Placeholder.ball != undefined) {
        const PlaceholderBallWidth = BallSize[Placeholder.ball - 1];
        context.drawImage(BallImages[Placeholder.ball - 1], Placeholder.x - PlaceholderBallWidth / 2, 510 - PlaceholderBallWidth / 2, PlaceholderBallWidth, PlaceholderBallWidth);
    }
});

Events.on(engine, "collisionStart", (e) => {
    for (let i = 0; i < e.pairs.length; i++) {
        let pair = e.pairs[i];

        // タグなしチェック
        if (pair.bodyA.tag == undefined) continue;
        if (pair.bodyB.tag == undefined) continue;

        // 危険ラインの判定はしない
        if (pair.bodyA.tag == "dangerLine") continue;
        if (pair.bodyB.tag == "dangerLine") continue;

        // 同じボールじゃないときは飛ばす
        if (pair.bodyA.tag != pair.bodyB.tag) {
            continue;
        }

        // 座標を計算
        const averageX = (pair.bodyA.position.x + pair.bodyB.position.x) / 2;
        const averageY = (pair.bodyA.position.y + pair.bodyB.position.y) / 2;
        const nextBall = pair.bodyA.tag + 1;

        // タグを消す
        pair.bodyA.tag = undefined;
        pair.bodyB.tag = undefined;

        // ボールを削除
        Composite.remove(engine.world, pair.bodyA);
        Composite.remove(engine.world, pair.bodyB);

        // 音を鳴らす
        playBallSound();

        // スコア反映
        GameDataScore += BallScore[nextBall - 1];

        // 次のボールがある場合は作成
        if (nextBall <= 15) {
            // 次のボールを生成
            createBall(averageX, averageY, nextBall);

            // 最大ボール反映
            if (GameDataBall < nextBall) {
                GameDataBall = nextBall;
                setSlot(nextBall);
            }
        }
    }
});

Events.on(engine, "collisionActive", (e) => {
    for (let i = 0; i < e.pairs.length; i++) {
        let pair = e.pairs[i];

        // タグなしチェック
        if (pair.bodyA.tag == undefined) continue;
        if (pair.bodyB.tag == undefined) continue;

        if (pair.bodyA.tag == "dangerLine") {
            // 衝突開始時判定
            if (pair.bodyB.startTime == undefined) {
                pair.bodyB.startTime = engine.timing.timestamp;
                pair.bodyB.render.overlay = true;
            }

            // 色の濃さを設定
            const percentage = (engine.timing.timestamp - pair.bodyB.startTime) / 3000;
            pair.bodyB.render.overlayOpacity = percentage;

            // 3秒後にゲームオーバー
            if (percentage >= 1) {
                gameOver();
                break;
            }
        }
        else if (pair.bodyB.tag == "dangerLine") {
            // 衝突開始時判定
            if (pair.bodyA.startTime == undefined) {
                pair.bodyA.startTime = performance.now();
                pair.bodyA.render.overlay = true;
            }

            // オーバーレイ表示
            const percentage = (performance.now() - pair.bodyA.startTime) / 3000;
            pair.bodyA.render.overlayOpacity = percentage;

            // 3秒後にゲームオーバー
            if (percentage >= 1) {
                gameOver();
                break;
            }
        }
    }
});

Events.on(engine, "collisionEnd", (e) => {
    for (let i = 0; i < e.pairs.length; i++) {
        let pair = e.pairs[i];

        // タグなしチェック
        if (pair.bodyA.tag == undefined) continue;
        if (pair.bodyB.tag == undefined) continue;

        // 衝突終了なので時間計測を終了
        if (pair.bodyA.tag == "dangerLine") {
            pair.bodyB.startTime = undefined;
            pair.bodyB.render.overlay = undefined;
        }
        else if (pair.bodyB.tag == "dangerLine") {
            pair.bodyA.startTime = undefined;
            pair.bodyA.render.overlay = undefined;
        }
    }
});

Events.on(runner, 'tick', () => {
    runner.deltaMin = runner.fps > 60 ? 1000 / runner.fps : 1000 / 60;
});

// タッチイベント
render.canvas.addEventListener("mousemove", mousemove);

function mousemove(e) {
    const x = (e.clientX - render.canvas.getBoundingClientRect().left) * 1080 / render.canvas.clientWidth;
    moveBall(x);
}

render.canvas.addEventListener("touchstart", touchstart);

function touchstart(e) {
    const x = (e.touches[0].clientX - render.canvas.getBoundingClientRect().left) * 1080 / render.canvas.clientWidth;
    e.preventDefault();
    moveBall(x);
}

render.canvas.addEventListener("touchmove", touchmove);

function touchmove(e) {
    const x = (e.touches[0].clientX - render.canvas.getBoundingClientRect().left) * 1080 / render.canvas.clientWidth;
    e.preventDefault();
    moveBall(x);
}

function moveBall(x) {
    if (Placeholder.ball == undefined) return;

    setPlaceholder(x);
}

render.canvas.addEventListener("mousedown", mousedown);

function mousedown(e) {
    const x = (e.clientX - render.canvas.getBoundingClientRect().left) * 1080 / render.canvas.clientWidth;
    placeBall(x);
}

render.canvas.addEventListener("touchend", touchend);

function touchend(e) {
    const x = (e.changedTouches[0].clientX - render.canvas.getBoundingClientRect().left) * 1080 / render.canvas.clientWidth;
    placeBall(x);
    e.preventDefault();
}

function placeBall(x) {
    if (Placeholder.ball == undefined) return;

    setPlaceholder(x);

    // ボール生成
    createBall(Placeholder.x, 510, Placeholder.ball);

    // 次に向けて設定
    Placeholder.ball = undefined;

    // 次を0.5秒後に出す
    setTimeout(next, 500);
}

function setPlaceholder(x) {
    // 左に行きすぎな場合の修正
    if (x < BallSize[Placeholder.ball - 1] / 2 + 25 / 2) {
        x = BallSize[Placeholder.ball - 1] / 2 + 25 / 2;
    }
    // 右に行きすぎな場合の修正
    else if (x > 1080 - BallSize[Placeholder.ball - 1] / 2 - 25 / 2) {
        x = 1080 - BallSize[Placeholder.ball - 1] / 2 - 25 / 2;
    }
    Placeholder.x = x;
}

// スタート関数
function start() {
    // ゲームデータをロード
    loadData();

    // プレースホルダーがないときはネクスト生成
    if (Placeholder.ball == undefined) {
        next();
    }

    window.addEventListener("beforeunload", saveData);
    window.addEventListener("blur", saveData);
    setTimeout(() => {
        localStorage.removeItem("data");
    }, 1000);
    startBgm();
}

// ゲーム終了関数
async function gameOver() {
    // 操作不能
    Placeholder.ball = undefined;
    render.canvas.removeEventListener("mousemove", mousemove);
    render.canvas.removeEventListener("touchstart", touchstart);
    render.canvas.removeEventListener("touchmove", touchmove);
    render.canvas.removeEventListener("touchend", touchend);
    render.canvas.removeEventListener("mousedown", mousedown);
    window.removeEventListener("beforeunload", saveData);
    window.removeEventListener("blur", saveData);

    // コールバックをすべて消す
    Events.off(engine, "collisionStart");
    Events.off(engine, "collisionActive");

    // シミュレーションストップ
    Runner.stop(runner);

    // 画像を取得
    try {
        const image = render.canvas.toDataURL("image/png");

        const resultImgElement = new Image();
        resultImgElement.src = image;
        resultImgElement.classList.add("resultImg");

        const resultImg = document.getElementById("resultImg");
        resultImg.appendChild(resultImgElement);
    }
    // 画像取得に失敗したときはログだけ表示
    catch (e) {
        console.log(e);
    }

    // ボールを消していく
    const Balls = engine.world.bodies.filter((e) => { return e.tag && e.tag > 0 });  // ボールでフィルター
    Balls.sort((a, b) => { return b.position.y - a.position.y });  // Y座標でソート
    for (let i = 0; i < Balls.length; i++) {
        const ball = Balls[i];
        Composite.remove(engine.world, ball);
        playBallSound();
        await sleep(100);
    }

    // 最後に0.5秒待つ
    await sleep(500);

    // ランキングチェック
    document.getElementById("scoreSpan").textContent = GameDataScore;
    if (GameDataScore <= lowestScore) {  // ランキング用のInputを非表示
        document.getElementById("nameInputSpan").style.display = "none";

        // ゲームオーバーサウンド
        playGameOverSound();
    }
    else {  // ランキング用のInputを表示
        // ファンファーレ
        playFanfareSound();
        generateConfetti();

        // ユーザーネームのキャッシュがあればそれを反映
        let username = localStorage.getItem("username");
        if (username != undefined) {
            document.getElementById("usernameInput").value = username;
        }
    }

    // ダイアログ表示
    // await sleep(1000);
    const dialog = document.getElementById("dialogWrapperDiv");
    dialog.style.opacity = 0;
    dialog.style.display = "flex";
    dialog.style.animation = "fadeIn 1s forwards";

    // 念のため削除
    localStorage.removeItem("data");
}

// 次に進める関数
function next() {
    Placeholder.ball = GameDataNext;
    GameDataNext = Math.floor(Math.random() * 5) + 1;
}

document.getElementById("dialogOkButton").onclick = okPressed;
// ランキング反映用のOKボタンが押されたとき
function okPressed() {
    // ランキング反映が必要ないときはそのままリロード
    if (GameDataScore <= lowestScore) {
        document.body.style.animation = "fadeOut 1s forwards";
        setTimeout(() => window.location.reload(), 1000);
        return;
    }

    // 名前を取得
    let username = document.getElementById("usernameInput").value;

    // 名前チェック
    if (username == "") {
        alert("ランキングで使う名前を入力してください。");
        return;
    }

    // 名前をキャッシュに保存
    localStorage.setItem("username", username);

    // プッシュ
    postRanking(username, GameDataScore, GameDataBall);
    document.body.style.animation = "fadeOut 1s forwards";
}

// ボール作成関数
function createBall(x, y, ballNum) {
    let ball = undefined;

    // ボディ生成
    // アメフトボール
    if (ballNum == 8) {
        ball = Bodies.fromVertices(x, y, eightVertices, {
            render: {
                sprite: {
                    texture: `./img/balls/${ballNum}.png`,
                    overlayTexture: "./img/balls/overlay8.png",
                    xScale: BallSize[ballNum - 1] / 500,
                    yScale: BallSize[ballNum - 1] / 500,
                },
            },
        });
    }
    // アメフトボール
    else if (ballNum == 14) {
        ball = Bodies.fromVertices(x, y, forteenVertices, {
            render: {
                sprite: {
                    texture: `./img/balls/${ballNum}.png`,
                    overlayTexture: "./img/balls/overlay8.png",
                    xScale: BallSize[ballNum - 1] / 500,
                    yScale: BallSize[ballNum - 1] / 500,
                },
            },
        });
    }
    // アメフトボール以外
    else {
        ball = Bodies.circle(x, y, BallSize[ballNum - 1] / 2, {
            render: {
                sprite: {
                    texture: `./img/balls/${ballNum}.png`,
                    overlayTexture: "./img/balls/overlay.png",
                    xScale: BallSize[ballNum - 1] / 500,
                    yScale: BallSize[ballNum - 1] / 500,
                },
            },
        });
    }

    // 反発係数設定
    switch (ballNum) {
        // スーパーボール
        case 2:
            ball.restitution = 0.8;
            break;

        // 鬼スーパーボール
        case 12:
            ball.restitution = 0.8;
            break;

        // ピンポンだま
        case 3:
            ball.restitution = 0.7;
            break;

        // デフォルト
        default:
            ball.restitution = 0;
            break;
    }

    // 重さ設定
    switch (ballNum) {
        // ピンポンだま
        case 3:
            Body.setMass(ball, 5);
            break;
    }

    // 全体設定
    ball["tag"] = ballNum;
    Composite.add(engine.world, ball);
    return ball;
}

// ボタン関数
function startGameButtonPressed() {
    // タイトルフェードアウト
    const titleDiv = document.getElementById("titleDiv");
    titleDiv.style.animation = "fadeOut 1s forwards";
    const buttons = titleDiv.getElementsByTagName("button");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }

    // フェードアウト終了時
    setTimeout(() => {
        // タイトルを削除
        titleDiv.remove();

        // ゲーム開始
        start();
    }, 1000);
}

function rankingButtonPressed() {
    document.getElementById("rankingDiv").scrollIntoView({
        behavior: "smooth",
    });
}

function howToPlayButtonPressed() {
    document.getElementById("howToPlayDiv").scrollIntoView({
        behavior: "smooth",
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}