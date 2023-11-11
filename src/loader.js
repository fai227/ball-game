window.addEventListener("beforeunload", saveData);
window.addEventListener("blur", saveData);

function saveData() {
    const Balls = engine.world.bodies.filter((e) => { return e.tag && e.tag > 0 });  // ボールでフィルター
    const SaveData = {
        balls: [],
        placeholder: Placeholder.ball,
        next: GameData.next,
        score: GameData.score,
    };
    Balls.forEach(ball => {
        SaveData.balls.push({
            x: ball.position.x,
            y: ball.position.y,
            angle: ball.angle,
            tag: ball.tag,
        });
    });

    localStorage.setItem("data", JSON.stringify(SaveData));
}

function loadData() {
    // データがあるかチェック
    if (localStorage.getItem("data") == undefined) {
        return false;
    }

    // データをロード
    const LoadData = JSON.parse(localStorage.getItem("data"));
    localStorage.removeItem("data");

    // データをロードするかチェック
    if (!confirm("前回のデータをロードしますか？")) {
        return false;
    }

    // ロードを反映
    Placeholder.ball = LoadData.placeholder;
    GameData.next = LoadData.next;
    GameData.score = LoadData.score;
    LoadData.balls.forEach(ball => {
        createBall(ball.x, ball.y, ball.tag, ball.angle);
    });

    return true;
}