// インポート
const Engine = Matter.Engine;
const Render = Matter.Render;
const Runner = Matter.Runner;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Composite = Matter.Composite;
const Events = Matter.Events;

// 定数設定
const BallSize = [75, 100, 140, 160, 200, 250, 295, 360, 400, 500, 600];

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

// 

// スタート関数
function start() {

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

