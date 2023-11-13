function saveData() {
    // 最大ボールが野球以下の場合は保存しない
    if (GameDataBall <= 7) {
        return;
    }

    const Balls = engine.world.bodies.filter((e) => { return e.tag && e.tag > 0 });  // ボールでフィルター
    const SaveData = {
        balls: [],
        placeholder: Placeholder.ball,
        next: GameDataNext,
        score: GameDataScore,
    };
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
    GameDataScore = LoadData.score;
    LoadData.balls.forEach(ball => {
        const BallObject = createBall(ball.x, ball.y, ball.tag);
        Body.setVelocity(BallObject, { x: ball.vx, y: ball.vy });
        Body.setAngle(BallObject, ball.angle);
    });
}