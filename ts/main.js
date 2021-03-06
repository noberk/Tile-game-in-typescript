var ctx = null;
var tileW = 40, tileH = 40;
var mapW = 10, mapH = 10;
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
var KeysDown = {
    37: false,
    38: false,
    39: false,
    40: false
};
function toIndex(x, y) {
    return y * mapW + x;
}
var Character = /** @class */ (function () {
    function Character() {
        this.tileFrom = [1, 1];
        this.tileTo = [1, 1];
        this.timeMoved = 0;
        this.dimensions = [30, 30];
        this.position = [45, 45];
        this.delayMove = 100;
    }
    Character.prototype.placeAt = function (x, y) {
        this.tileFrom = [x, y];
        this.tileTo = [x, y];
        this.position = [
            ((tileW * x) + (tileW - this.dimensions[0]) / 2),
            ((tileH * y) + (tileH - this.dimensions[1]) / 2)
        ];
    };
    Character.prototype.processMovement = function (t) {
        if (this.tileFrom[0] == this.tileTo[0] &&
            this.tileFrom[1] == this.tileTo[1]) {
            return false;
        }
        if ((t - this.timeMoved) >= this.delayMove) {
            this.placeAt(this.tileTo[0], this.tileTo[1]);
        }
        else {
            this.position[0] = (this.tileFrom[0] * tileW) +
                (tileW - this.dimensions[0]) / 2;
            this.position[1] = (this.tileFrom[1] * tileH) +
                (tileH - this.dimensions[1] / 2);
            //horizotal
            if (this.tileTo[0] != this.tileFrom[0]) {
                var diff = (tileW / this.delayMove) * (t - this.timeMoved);
                this.position[0] += (this.tileTo[0] < this.tileFrom[0] ? 0 - diff : diff);
            }
            //vertical
            if (this.tileTo[1] != this.tileFrom[1]) {
                var diff = (tileH / this.delayMove) * (t - this.timeMoved);
                this.position[1] += (this.tileTo[1] < this.tileFrom[1] ? 0 - diff : diff);
            }
            this.position[0] = Math.round(this.position[0]);
            this.position[1] = Math.round(this.position[1]);
        }
        return true;
    };
    return Character;
}());
var player = new Character();
window.onload = function () {
    var canvas = document.getElementById('game');
    canvas.width = canvasW;
    canvas.height = canvasH;
    ctx = canvas.getContext("2d");
    requestAnimationFrame(drawGame);
    ctx.font = "bold 10pt sans-serif";
    addEventListener("keydown", function (e) {
        if (e.keyCode >= 37 && e.keyCode <= 40) {
            KeysDown[e.keyCode] = true;
        }
    });
    addEventListener("keyup", function (e) {
        if (e.keyCode >= 37 && e.keyCode <= 40) {
            KeysDown[e.keyCode] = false;
        }
    });
};
function drawGame() {
    if (ctx == null) {
        return;
    }
    var currentFrameTime = Date.now();
    var timeElapsed = currentFrameTime - lastFrameTime;
    var sec = Math.floor(Date.now() / 1000);
    if (sec != currentSecond) {
        currentSecond = sec;
        framesLastSecond = frameCount;
        frameCount = 1;
    }
    else {
        frameCount++;
    }
    if (!player.processMovement(currentFrameTime)) {
        if (KeysDown[38] && player.tileFrom[1] > 0 &&
            gameMap[toIndex(player.tileFrom[0], player.tileFrom[1] - 1)] == 1) {
            player.tileTo[1] -= 1;
        }
        else if (KeysDown[40] && player.tileFrom[1] < (mapH - 1) &&
            gameMap[toIndex(player.tileFrom[0], player.tileFrom[1] + 1)] == 1) {
            player.tileTo[1] += 1;
        }
        else if (KeysDown[37] && player.tileFrom[0] > 0 &&
            gameMap[toIndex(player.tileFrom[0] - 1, player.tileFrom[1])] == 1) {
            player.tileTo[0] -= 1;
        }
        else if (KeysDown[39] && player.tileFrom[0] < (mapW - 1) &&
            gameMap[toIndex(player.tileFrom[0] + 1, player.tileFrom[1])] == 1) {
            player.tileTo[0] += 1;
        }
        if (player.tileFrom[0] != player.tileTo[0] ||
            player.tileFrom[1] != player.tileTo[1]) {
            player.timeMoved = currentFrameTime;
        }
    }
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
    ctx.fillStyle = "#00f";
    ctx.fillRect(player.position[0], player.position[1], player.dimensions[0], player.dimensions[1]);
    ctx.fillStyle = "#f00";
    ctx.fillText("fps: " + framesLastSecond, 10, 20);
    lastFrameTime = currentFrameTime;
    requestAnimationFrame(drawGame);
}
