const slotWrapper = document.getElementById("slotWrapperDiv");
const slot = document.getElementById("slot");
let previousBallId = 0;

function setSlot(ballId) {
    // フェードイン
    slotWrapper.style.animation = "fadeIn 0.5s forwards";
    slotWrapper.style.display = "block";

    // 普通の場合
    if (ballId <= 11) {
        // 0.5秒待って移動
        setTimeout(() => {
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
                slotWrapper.style.animation = "fadeOut 0.5s forwards";
                setTimeout(() => {
                    slotWrapper.style.display = "none";
                }, 500);
            }, 1000);
        }, 500);
    }
    // 初めて鬼モードになるとき
    else if (previousBallId <= 11) {

    }
    // 鬼モードを普通に回す
    else {

    }

    previousBallId = ballId;
}