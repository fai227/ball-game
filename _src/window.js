const wrappingDiv = document.getElementById("wrappingDiv");
const canvas = document.getElementById("canvas");

wrappingDiv.addEventListener("click", (e) => e.preventDefault());
window.addEventListener("resize", resetElementsSize);
window.addEventListener("load", resetElementsSize);

function resetElementsSize() {
    const height = document.documentElement.clientHeight;
    const width = document.body.clientWidth;
    const wrappingDivWidth = height / width < 16 / 9 ? Math.round(height * 0.95 / 16 * 9) : width * 0.95;

    wrappingDiv.style.width = wrappingDivWidth + "px";
    canvas.style.width = Math.round(wrappingDivWidth * 0.95) + "px";
    canvas.style.height = Math.round(wrappingDivWidth * 0.95 / 9 * 16) + "px";
}

