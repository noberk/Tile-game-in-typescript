var ctx = null;
var tileW = 80, tileH = 80, mapW = 10, mapH = 10;
var canvasH = 1000, canvasW = 1000;
var currentSecond = 0, frameCount = 0, framesLastSecond = 0;
var lastFrameTime = 0;
var gameMap = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 0, 1, 1, 1, 1, 0,
    0, 1, 0, 0, 0, 1, 0, 0, 0, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 0, 1, 0, 0, 0, 1, 1, 0,
    0, 1, 0, 1, 0, 1, 0, 0, 1, 0,
    0, 1, 1, 1, 0, 1, 1, 1, 1, 0,
    0, 1, 0, 0, 0, 1, 0, 0, 0, 0,
    0, 1, 1, 1, 0, 1, 1, 1, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0
];
window.onload = function () {
    var canvas = document.getElementById('game');
    canvas.width = canvasW;
    canvas.height = canvasH;
    ctx = canvas.getContext("2d");
    requestAnimationFrame(drawGame);
    ctx.font = "bold 10pt sans-serif";
};
function drawGame() {
    if (ctx == null) {
        return;
    }
    var sec = Math.floor(Date.now() / 1000);
    if (sec != currentSecond) {
        currentSecond = sec;
        framesLastSecond = frameCount;
        frameCount = 1;
    }
    else
        frameCount++;
    for (var y = 0; y < mapH; y++) {
        for (var x = 0; x < mapH; x++) {
            switch (gameMap[((y * mapW) + x)]) {
                case 0:
                    ctx.fillStyle = "grey";
                    break;
                default:
                    ctx.fillStyle = "white";
                    break;
            }
            ctx.fillRect(x * tileW, y * tileH, tileW, tileH);
        }
    }
    ctx.fillStyle = "#f00";
    ctx.fillText("fps: " + framesLastSecond, 10, 20);
    requestAnimationFrame(drawGame);
}
