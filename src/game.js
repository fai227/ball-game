// インポート
const Engine = Matter.Engine;
const Render = Matter.Render;
const Runner = Matter.Runner;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Composite = Matter.Composite;
const Events = Matter.Events;

// 定数設定
const bubbleImage = new Image(); bubbleImage.src = "./img/bubble.png";
const ballImages = []; for (let i = 1; i <= 11; i++) { const tmpImage = new Image(); tmpImage.src = `./img/balls/${i}.png`; ballImages.push(tmpImage) };
const BallSize = [75, 100, 140, 160, 200, 250, 295, 360, 400, 500, 600];
const gameData = { score: 0, ball: 1, next: 1 };
const placeholder = { x: 540, ball: undefined };

// 環境設定
const engine = Engine.create();
const render = Render.create({
    canvas: document.getElementById("canvas"),
    engine: engine,
    options: {
        width: 1080,
        height: 1980,
        wireframes: false,
        background: 'transparent',
        wireframeBackground: 'transparent'
    },
});
Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);

// 初期設定
function setPlatforms() {
    const bottomPlatform = Bodies.rectangle(540, 1980 - 25 / 2, 1080, 25, {
        render: {
            sprite: { texture: "./img/horizontalBorder.png" }
        }
    });
    Matter.Body.setStatic(bottomPlatform, true);
    Composite.add(engine.world, bottomPlatform);

    const dangerLine = Bodies.rectangle(540, 1980 - 1321 + 25 / 2, 1080, 25, {
        render: {
            fillStyle: "#ff000055",
        }
    });
    dangerLine.isSensor = true;
    dangerLine.tag = "dangerLine";
    Matter.Body.setStatic(dangerLine, true);
    Composite.add(engine.world, dangerLine);

    const leftPlatform = Bodies.rectangle(25 / 2, 1980 - 1321 / 2, 25, 1321, {
        render: {
            sprite: { texture: "./img/verticalBorder.png" }
        }
    });
    Matter.Body.setStatic(leftPlatform, true);
    Composite.add(engine.world, leftPlatform);

    const rightPlatform = Bodies.rectangle(1080 - 25 / 2, 1980 - 1321 / 2, 25, 1321, {
        render: {
            sprite: { texture: "./img/verticalBorder.png" }
        }
    });
    Matter.Body.setStatic(rightPlatform, true);
    Composite.add(engine.world, rightPlatform);
}
setPlatforms();

// 物理演算イベント
Events.on(render, "afterRender", () => {
    // 初期設定
    const context = render.context;
    context.fillStyle = "white";
    context.strokeStyle = "#7a5829";
    context.lineWidth = 8;
    context.textAlign = "center";
    render.context.font = Math.round(render.canvas.width * 0.08) + "px 'HeaderFont'";

    // スコア表示
    context.drawImage(bubbleImage, 100, 50, 300, 300);
    context.fillText("スコア", 250, 80);
    context.strokeText("スコア", 250, 80);
    context.fillText(gameData.score, 250, 230, 250);
    context.strokeText(gameData.score, 250, 230, 250);

    // ネクスト表示
    context.drawImage(bubbleImage, 680, 50, 300, 300);
    context.fillText("ネクスト", 830, 80);
    context.strokeText("ネクスト", 830, 80);
    const nextBallWidth = BallSize[gameData.next - 1];
    context.drawImage(ballImages[gameData.next - 1], 830 - nextBallWidth / 2, 200 - nextBallWidth / 2, nextBallWidth, nextBallWidth);

    // プレースホルダーを表示
    if (placeholder.ball != undefined) {
        const placeholderBallWidth = BallSize[placeholder.ball - 1];
        context.drawImage(ballImages[placeholder.ball - 1], placeholder.x - placeholderBallWidth / 2, 510 - placeholderBallWidth / 2, placeholderBallWidth, placeholderBallWidth);
    }
});

Events.on(engine, "collisionStart", (e) => {
    for (let i = 0; i < e.pairs.length; i++) {
        let pair = e.pairs[i];

        // タグなしチェック
        if (pair.bodyA.tag == undefined) continue;
        if (pair.bodyB.tag == undefined) continue;

        // Aが危険ラインの時
        if (pair.bodyA.tag == "dangerLine") {
            // 初めて通るので次を出す
            if (pair.bodyB.gone == undefined) {
                pair.bodyB.gone = true;
                next();
                continue;
            }

            // 2回目にあたったので，ゲームオーバー
            gameOver();
            break;
        }
        // Bが危険ラインの時
        else if (pair.bodyB.tag == "dangerLine") {
            // 初めて通るので次を出す
            if (pair.bodyA.gone == undefined) {
                pair.bodyA.gone = true;
                next();
                continue;
            }

            // 2回目にあたったので，ゲームオーバー
            gameOver();
            break;
        }

        // 同じボールじゃないとき
        if (pair.bodyA.tag != pair.bodyB.tag) continue;

        // 同じボールの時
        const averageX = (pair.bodyA.position.x + pair.bodyB.position.x) / 2;
        const averageY = (pair.bodyA.position.y + pair.bodyB.position.y) / 2;
        const nextBall = pair.bodyA.tag + 1;

        Composite.remove(engine.world, pair.bodyA);
        Composite.remove(engine.world, pair.bodyB);

        createBall(averageX, averageY, nextBall);
    }
});

// タッチイベント
render.canvas.addEventListener("pointermove", (e) => {
    const x = (e.clientX - render.canvas.getBoundingClientRect().left) * 1080 / render.canvas.clientWidth;
    setPlaceholder(x);
});
render.canvas.addEventListener("pointerup", (e) => {
    if (placeholder.ball == undefined) return;


    // 最終移動
    const x = (e.clientX - render.canvas.getBoundingClientRect().left) * 1080 / render.canvas.clientWidth;
    setPlaceholder(x);

    // ボール生成
    createBall(placeholder.x, 510, placeholder.ball);

    // 次に向けて設定
    placeholder.ball = undefined;
});

function setPlaceholder(x) {
    // 左に行きすぎな場合の修正
    if (x < BallSize[placeholder.ball - 1] / 2 + 25 / 2) {
        x = BallSize[placeholder.ball - 1] / 2 + 25 / 2;
    }
    // 右に行きすぎな場合の修正
    else if (x > 1080 - BallSize[placeholder.ball - 1] / 2 - 25 / 2) {
        x = 1080 - BallSize[placeholder.ball - 1] / 2 - 25 / 2;
    }
    placeholder.x = x;
}


// スタート関数
function start() {
    next();
}

// ゲーム終了関数
function gameOver() {
    // シミュレーションを止める
}

// 次に進める関数
function next() {
    placeholder.ball = gameData.next;
    gameData.next = Math.floor(Math.random() * 5) + 1;

}

// ボール作成関数
function createBall(x, y, ballNum) {
    const ball = Bodies.circle(x, y, BallSize[ballNum - 1] / 2, {
        render: {
            sprite: {
                texture: `./img/balls/${ballNum}.png`,
                xScale: BallSize[ballNum - 1] / 1000,
                yScale: BallSize[ballNum - 1] / 1000,
            },
        },
    });
    ball["tag"] = ballNum;
    Composite.add(engine.world, ball);
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

