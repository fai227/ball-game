const https = "https";
const dataCenter = "data-center";
const azurewebsites = "azurewebsites";
const net = "net";
const ballGame = "ball-game";
const ranking = "ranking";
const rankingTable = document.getElementById("rankingTable");
let lowestScore = 0;

function getUrl() {
    return https + "://" + dataCenter + "." + azurewebsites + "." + net + "/" + ballGame + "/" + ranking;
}

function setRanking(rankingData) {
    // 子をすべて削除
    while (rankingTable.firstChild) {
        rankingTable.removeChild(rankingTable.firstChild);
    }

    // ヘッダー作成
    const nameHeaderRow = document.createElement("tr");
    rankingTable.appendChild(nameHeaderRow);
    const weekHeader = document.createElement("th");
    weekHeader.textContent = "週間";
    nameHeaderRow.appendChild(weekHeader);
    const totalHeader = document.createElement("th");
    totalHeader.textContent = "全体";
    nameHeaderRow.appendChild(totalHeader);

    function getRankDivs(rank, data) {
        const td = document.createElement("td");

        if (data != undefined) {
            td.classList.add(`rank${rank}Td`);

            const nameDiv = document.createElement("div");
            nameDiv.innerHTML = `${rank}位 ${data.name}`;
            nameDiv.classList.add("nameDiv");
            td.appendChild(nameDiv);
            const scoreDiv = document.createElement("div");
            scoreDiv.innerHTML = `<img src="./img/balls/${data.ball}.png" class="rankingBallImg"> ${data.score}点`;
            scoreDiv.classList.add("scoreDiv");
            td.appendChild(scoreDiv);
        }

        return td;
    }

    // ランキング反映
    for (let rankNum = 0; rankNum < 10; rankNum++) {
        const rankRow = document.createElement("tr");
        rankingTable.append(rankRow)
        const weekData = getRankDivs(rankNum + 1, rankingData["week"][rankNum]);
        rankRow.appendChild(weekData);
        const totalData = getRankDivs(rankNum + 1, rankingData["total"][rankNum]);
        rankRow.appendChild(totalData);
    }
}

async function postRanking(name, score, ball) {
    // 成功するまでPOSTし続ける
    while (true) {
        try {
            const result = await fetch(
                getUrl(),
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "name": name,
                        "score": score,
                        "ball": ball,
                    })
                }
            );

            // 成功ステータス以外が返ってきたときは例外発生
            if (!result.ok) {
                throw new Error(result.statusText);
            }

            // 成功したので反映して終了
            const data = await result.json();
            setRanking(data);
            break;
        } catch (e) {
            let yes = confirm("ランキング反映中にエラーが発生しました．リトライしますか？\n（エラーが続く場合はご報告ください）");
            // リトライしない場合は終了
            if (!yes) {
                break;
            }
        }
    }

    // 念のため削除
    localStorage.removeItem("data");

    // リロード
    setTimeout(() => window.location.reload(), 1000);
}

async function getRanking() {
    const result = await fetch(getUrl());
    const data = await result.json();

    if (data["week"].length == 10) {
        lowestScore = data["week"][data["week"].length - 1].score;
    }

    setRanking(data);
}

window.addEventListener("load", getRanking);