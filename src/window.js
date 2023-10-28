const wrappingDiv = document.getElementById("wrappingDiv");
const canvas = document.getElementById("canvas");

window.addEventListener("resize", resetElementsSize);
window.addEventListener("load", resetElementsSize);

function resetElementsSize() {
    const height = document.documentElement.clientHeight;
    const width = document.body.clientWidth;
    const wrappingDivWidth = height / width < 16 / 9 ? Math.round(height / 16 * 9) : width * 0.95;

    wrappingDiv.style.width = wrappingDivWidth + "px";
    canvas.width = Math.round(wrappingDivWidth * 0.9);
    canvas.height = Math.round(canvas.width / 9 * 16);
}
