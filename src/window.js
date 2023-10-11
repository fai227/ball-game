let wrappingDiv = document.getElementById("wrappingDiv");
let canvas = document.getElementById("canvas");

window.addEventListener("resize", resetElementsSize);
window.addEventListener("load", resetElementsSize);

function resetElementsSize() {
    let height = window.innerHeight;
    let width = window.innerWidth;
    let wrappingDivWidth = height / width < 16 / 9 ? Math.round(height / 16 * 9) : width;

    wrappingDiv.style.width = wrappingDivWidth + "px";
    canvas.width = Math.round(wrappingDivWidth * 0.9);
    canvas.height = Math.round(canvas.width / 9 * 16);
}
