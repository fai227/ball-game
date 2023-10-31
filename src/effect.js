const slotWrapper = document.getElementById("slotWrapperDiv");
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