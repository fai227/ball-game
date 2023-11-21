const ScoreText = "score";
const MaxBall = "max_ball";

function saveData() {
    // 最大ボールがビリヤードだま以下の場合は保存しない
    if (GameDataBall <= 5) {
        return;
    }

    const Balls = engine.world.bodies.filter((e) => { return e.tag && e.tag > 0 });  // ボールでフィルター
    const SaveData = {
        balls: [],
        placeholder: Placeholder.ball,
        next: GameDataNext,
    };
    SaveData[MaxBall] = GameDataBall;
    SaveData[ScoreText] = GameDataScore;

    Balls.forEach(ball => {
        SaveData.balls.push({
            x: ball.position.x,
            y: ball.position.y,
            vx: ball.velocity.x,
            vy: ball.velocity.y,
            angle: ball.angle,
            tag: ball.tag,
        });
    });

    localStorage.setItem("data", JSON.stringify(SaveData));
}

function loadData() {
    // データがあるかチェック
    if (localStorage.getItem("data") == undefined) {
        return;
    }

    // データをロード
    const LoadData = JSON.parse(localStorage.getItem("data"));

    // データをロードするかチェック
    if (!confirm("前回のデータをロードしますか？")) {
        return;
    }

    // ロードを反映
    Placeholder.ball = LoadData.placeholder;
    GameDataNext = LoadData.next;
    GameDataScore = LoadData[ScoreText];
    GameDataBall = LoadData[MaxBall];
    LoadData.balls.forEach(ball => {
        const BallObject = createBall(ball.x, ball.y, ball.tag);
        Body.setVelocity(BallObject, { x: ball.vx, y: ball.vy });
        Body.setAngle(BallObject, ball.angle);
    });
}