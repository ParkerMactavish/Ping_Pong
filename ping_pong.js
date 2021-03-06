class POS2D_t {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    set_Pos(x, y) {
        this.x = Number(x);
        this.y = Number(y);
    }
}

class BOMB_AND_SPEED_t {
    bomb;
    speed;
    constructor(bomb_, speed_) {
        this.bomb = bomb_;
        this.speed = speed_;
    }
}

/**
 * Game State Definition
 * {
 */
const IN_MENU = 0;
const IN_GAME = 1;
const IN_PAUSE = 2;
const IN_DEAD = 3;
/**
 * }
 */

var gameState = IN_MENU;

const BALL_SIZE = 2;
/**
 * Parameters
 * {
 */
var multipleOfHW;
var ballMovingPerUpdate = 0.1;
var widthOfBar = 20;
var heightOfBar = 5;
var boundaryOfBar;
var ballMovingDegree = -36;
var bombsMovingPerUpdate = 0.2;
var bombsAccelPerUpdate = 0.03;
var bombsFrequency = 11000;
/**
 * }
 */

var balls = [];
var bar;
var bombs = [];

/**
 * Ball speed controling group
 * {
 */
var ballSpeedController;
var ballSpeedControllerLabel;
var ballSpeedSetting;
/**
 * }
 */

/**
 * Bomb speed controling group
 * {
 */
var bombSpeedController;
var bombSpeedControllerLabel;
var bombSpeedSetting;
/**
 * }
 */

/**
 * Duration label
 * {
 */
var timeDisplaying;
var durationLabel;
var bombCount;
/**
 * }
 */

/**
 * Start menu
 * {
 */
var startButton;
var title;
var pausedLabel;
/**
 * }
 */

/**
 * Pause button
 * {
 */
var pauseButton;
/**
 * }
 */

/**
 * About button
 * {
 */
var aboutButton;
var aboutContent;
/**
 * }
 */

/**
 * Failed menu
 * {
 */
var failedLabel;
var resultDurationTime;
var resultBombCount;
var restartButton;
/**
 * }
 */

var fontSize;

/**
 * In game record
 * {
 */
var lastStartedTime;
/**
 * }
 */


/**
 * Position variables
 * {
 */
var currentBall0Pos = new POS2D_t(0, 0);
var nextBall0Pos = new POS2D_t(0, 0);
var ballSize = new POS2D_t(0, 0);
/* position of bar is set as (80, y) */
/**
 * }
 */

/**
 * Store Arrows and Shift keydown
 * {
 */
var isPressed = {
    shift: false,
    up: false,
    down: false
}
/**
 * }
 */


function degreeToGradian(degree) {
    return degree * Math.PI / 180;
}

function normalizeDegree(degree) {
    if (degree > 180) {
        do { degree -= 360; } while (degree > 180);
    }
    else if (degree < -179) {
        do { degree += 360; } while (degree < -179);
    }
    return degree;
}

function willCollide(nextBall0Pos) {
    var crossingX = (80 - ballSize.y - currentBall0Pos.y) / (nextBall0Pos.y - currentBall0Pos.y) * (nextBall0Pos.x - currentBall0Pos.x) + currentBall0Pos.x;
    // console.log("[Crossing X]", crossingX);

    if (bar.offsetLeft <= crossingX * window.innerWidth / 100 && bar.offsetLeft + widthOfBar * window.innerWidth / 100 > crossingX * window.innerWidth / 100)
        return true;
    return false;
}

function start() {
    multipleOfHW = window.innerHeight / window.innerWidth;

    ballSpeedSetting = document.getElementById("ballSpeedSetting");
    ballSpeedController = document.getElementById("ballSpeedSlider");
    ballSpeedControllerLabel = document.getElementById("ballSpeedSettingLabel");
    set_speedSettingStyle(true, false);

    bombSpeedSetting = document.getElementById("bombSpeedSetting");
    bombSpeedController = document.getElementById("bombSpeedSlider");
    bombSpeedControllerLabel = document.getElementById("bombSpeedSettingLabel");
    set_speedSettingStyle(true, true);

    timeDisplaying = document.getElementById("timeDisplaying");

    fontSize = window.innerHeight / 929 * 2 + "em";
    ballSpeedControllerLabel.style.fontSize = fontSize;
    bombSpeedControllerLabel.style.fontSize = fontSize;
    timeDisplaying.style.fontSize = fontSize;
    durationLabel = document.getElementById("durationTime");
    durationLabel.innerHTML = "0.000";
    bombCount = document.getElementById("bombCount");
    bombCount.innerHTML = "0";
    lastStartedTime = Date.now();

    startButton = document.getElementById("start");
    startButton.style.height = "20%";
    startButton.style.width = 20 * multipleOfHW + "%";
    startButton.style.top = 50 - 10 + "%";
    startButton.style.left = 50 - 10 * multipleOfHW + "%";
    startButton.style.visibility = "visible";

    title = document.getElementById("title");
    title.style.height = "20%";
    title.style.width = 50 * multipleOfHW + "%";
    title.style.top = "60%";
    title.style.left = 50 - 25 * multipleOfHW + "%";
    title.style.visibility = "visible";


    bar = document.getElementById("bar");
    document.addEventListener("mousemove", set_Mouse)
    bar.style.top = "80%";
    bar.style.left = "50%";
    bar.style.height = heightOfBar + "%";
    bar.style.width = widthOfBar + "%";
    boundaryOfBar = Math.round(window.innerWidth * (1 - widthOfBar / 100), 0);

    ballSize.set_Pos(BALL_SIZE * multipleOfHW, BALL_SIZE);
    for (var i = 0; i < 5; i++) {
        balls.push(document.getElementById("ball" + i));
    }
    balls[4].style.visibility = "visible";
    balls[4].style.width = ballSize.x + "%";
    balls[4].style.height = ballSize.y + "%";
    balls[4].style.left = "0%";
    balls[4].style.top = "0%";
    currentBall0Pos.set_Pos(0, 0);
    ballMovingPerUpdate = 1;

    pauseButton = document.getElementById("pause");
    pauseButton.style.height = "10%";
    pauseButton.style.width = 10 * multipleOfHW + "%";
    pauseButton.style.top = "2.5%";
    pauseButton.style.left = "2.5%";
    pauseButton.style.visibility = "hidden";

    aboutButton = document.getElementById("show_about");
    aboutButton.style.height = "8%";
    aboutButton.style.width = 8 * multipleOfHW + "%";
    aboutButton.style.top = "70%";
    aboutButton.style.left = "2.5%";
    aboutButton.style.visibility = "visible";
    aboutButton.onmousedown = show_about;
    aboutButton.onmouseup = remove_about;

    aboutContent = document.getElementById("about");
    aboutContent.style.visibility = "hidden";
    aboutContent.style.height = "50%";
    aboutContent.style.width = 100 * multipleOfHW + "%";
    aboutContent.style.bottom = "25%";
    aboutContent.style.left = 2.5 + 8 * multipleOfHW + "%";

    pausedLabel = document.getElementById("paused_label");
    pausedLabel.style.height = "20%";
    pausedLabel.style.width = 50 * multipleOfHW + "%";
    pausedLabel.style.top = "60%";
    pausedLabel.style.left = 50 - 25 * multipleOfHW + "%";
    pausedLabel.style.visibility = "hidden";

    failedLabel = document.getElementById("failed_label");
    failedLabel.style.height = "50%";
    failedLabel.style.width = 56.94 * multipleOfHW + "%";
    failedLabel.style.top = "20%";
    failedLabel.style.left = 50 - 28.47 * multipleOfHW + "%";
    failedLabel.style.fontSize = (Number(fontSize.split('e')[0]) * 2) + "em";
    failedLabel.style.visibility = "hidden";
    resultDurationTime = document.getElementById("resultDurationTime");
    resultBombCount = document.getElementById("resultBombCount");

    restartButton = document.getElementById("restart");
    restartButton.style.height = "20%";
    restartButton.style.width = 20 * multipleOfHW + "%";
    restartButton.style.top = "65%";
    restartButton.style.left = 50 - 10 * multipleOfHW + "%";
    restartButton.style.visibility = "hidden";

    setTimeout(function () {
        update(Infinity);
        // update(0);
    }, 10);
    setTimeout(generateBomb, 1);
}

function update(times) {
    if (!times) return;

    else if (gameState == IN_MENU) {
        nextBall0Pos.set_Pos(
            currentBall0Pos.x - ballMovingPerUpdate * Math.sin(degreeToGradian(ballMovingDegree)),
            currentBall0Pos.y + ballMovingPerUpdate * Math.cos(degreeToGradian(ballMovingDegree)) / multipleOfHW
        );
        // console.log("--------------" + times);
        // console.log(nextBall0Pos);
        if (nextBall0Pos.x > 100 - ballSize.x) {
            nextBall0Pos.x = (100 - ballSize.x) * 2 - nextBall0Pos.x;
            ballMovingDegree = - ballMovingDegree - 10 + Math.random() * 20;
        }
        else if (nextBall0Pos.x < 0) {
            nextBall0Pos.x = -nextBall0Pos.x;
            ballMovingDegree = - ballMovingDegree - 10 + Math.random() * 20;
        }
        if (nextBall0Pos.y > 100 - ballSize.y) {
            nextBall0Pos.y = (100 - ballSize.y) * 2 - nextBall0Pos.y;
            ballMovingDegree = - (ballMovingDegree + 90) - 90 - 10 + Math.random() * 20;
        }
        else if (nextBall0Pos.y < 0) {
            nextBall0Pos.y = -nextBall0Pos.y;
            ballMovingDegree = - (ballMovingDegree + 90) - 90 - 10 + Math.random() * 20;
        }

        balls[4].style.left = nextBall0Pos.x + "%";
        balls[4].style.top = nextBall0Pos.y + "%";
        currentBall0Pos.set_Pos(nextBall0Pos.x, nextBall0Pos.y);
    }
    else if (gameState == IN_GAME) {
        for (var i = 4; i > 0; i--) {
            balls[i].style.left = balls[i - 1].offsetLeft;
            balls[i].style.top = balls[i - 1].offsetTop;
        }
        nextBall0Pos.set_Pos(
            currentBall0Pos.x - ballMovingPerUpdate * Math.sin(degreeToGradian(ballMovingDegree)),
            currentBall0Pos.y + ballMovingPerUpdate * Math.cos(degreeToGradian(ballMovingDegree)) / multipleOfHW
        );
        if (nextBall0Pos.x > 100 - ballSize.x) {
            nextBall0Pos.x = (100 - ballSize.x) * 2 - nextBall0Pos.x;
            ballMovingDegree = - ballMovingDegree - 10 + Math.random() * 20;
        }
        else if (nextBall0Pos.x < 0) {
            nextBall0Pos.x = -nextBall0Pos.x;
            ballMovingDegree = - ballMovingDegree - 10 + Math.random() * 20;
        }
        if (nextBall0Pos.y > 100) {
            changeState(IN_DEAD);
        }
        else if (nextBall0Pos.y + ballSize.y > 80 && currentBall0Pos.y + ballSize.y < 80 && willCollide(nextBall0Pos)) {
            nextBall0Pos.y = (80 - ballSize.y) * 2 - nextBall0Pos.y;
            ballMovingDegree = - (ballMovingDegree + 90) - 90 - 10 + Math.random() * 20;
        }
        else if (nextBall0Pos.y < 0) {
            nextBall0Pos.y = -nextBall0Pos.y;
            ballMovingDegree = - (ballMovingDegree + 90) - 90 - 10 + Math.random() * 20;
        }

        balls[0].style.left = nextBall0Pos.x + "%";
        balls[0].style.top = nextBall0Pos.y + "%";
        currentBall0Pos.set_Pos(nextBall0Pos.x, nextBall0Pos.y);

        ballMovingDegree = normalizeDegree(ballMovingDegree);
        // balls.forEach(_ => console.log(_));

        var toRemove = false;
        bombs.forEach(_ => {
            var thisPosOf_ = Number(_.bomb.style.top.split('%')[0]);
            _.speed += bombsAccelPerUpdate;
            var nextPosOf_ = thisPosOf_ + _.speed;
            if (nextPosOf_ >= 100) {
                try {
                    document.body.removeChild(_.bomb);
                }
                catch { };
                bombCount.innerHTML = Number(bombCount.innerHTML) + 1 + "";
                toRemove = true;
            }
            else if (nextPosOf_ > 65 && thisPosOf_ < 80) {
                if (Number(_.bomb.style.left.split('%')[0]) < bar.offsetLeft * 100 / window.innerWidth + widthOfBar && Number(_.bomb.style.left.split('%')[0]) + 5 > bar.offsetLeft * 100 / window.innerWidth) {
                    changeState(IN_DEAD);
                }
            }
            _.bomb.style.top = nextPosOf_ + "%";
            console.log(nextPosOf_);
        });
        if (toRemove) bombs.splice(0, 1);
    }
    if (gameState == IN_GAME) durationLabel.innerHTML = (Date.now() - lastStartedTime) / 1000;
    else lastStartedTime = Date.now() - Number(durationLabel.innerHTML) * 1000;
    setTimeout(function () {
        update(--times);
    }, 10);
}

window.onresize = function () {
    multipleOfHW = window.innerHeight / window.innerWidth;
    console.log(multipleOfHW);
    ballSize.set_Pos(BALL_SIZE * multipleOfHW, BALL_SIZE);
    balls.forEach(_ => {
        _.style.width = ballSize.x + "%";
        _.style.height = ballSize.y + "%";
    });
    fontSize = window.innerHeight / 929 * 2 + "em";
    ballSpeedControllerLabel.style.fontSize = fontSize;
    bombSpeedControllerLabel.style.fontSize = fontSize;
    timeDisplaying.style.fontSize = fontSize;
    failedLabel.style.fontSize = fontSize * 3;
    boundaryOfBar = Math.round(window.innerWidth * (1 - widthOfBar / 100), 0);
    startButton.style.height = "20%";
    startButton.style.width = 20 * multipleOfHW + "%";
    startButton.style.top = 50 - 10 + "%";
    startButton.style.left = 50 - 10 * multipleOfHW + "%";
    pauseButton.style.height = "10%";
    pauseButton.style.width = 10 * multipleOfHW + "%";
    pauseButton.style.top = "2.5%";
    pauseButton.style.left = "2.5%";
    aboutButton.style.height = "8%";
    aboutButton.style.width = 8 * multipleOfHW + "%";
    aboutButton.style.top = "70%";
    aboutButton.style.left = "2.5%";
}

document.onkeydown = function (e) {
    var code = e.code;
    switch (gameState) {
        case IN_MENU:
            if (code == "Space")
                changeState(IN_GAME);
            break;
        case IN_GAME:
            if (code == "Space") {
                changeState(IN_PAUSE);
            }
            else if (code == "ArrowUp") {
                var oldValue = Number(ballSpeedController.value);
                ballSpeedController.value = (oldValue < 10) ? oldValue + 1 + "" : ballSpeedController.value;
                changeBallSpeed();
            }
            else if (code == "ArrowDown") {
                var oldValue = Number(ballSpeedController.value);
                ballSpeedController.value = (oldValue > 1) ? oldValue - 1 + "" : ballSpeedController.value;
                changeBallSpeed();
            }
            // else if (code == "ShiftLeft") {
            //     isPressed.shift = true;
            // }
            else if (code == "ArrowLeft") {
                var oldValue = Number(bombSpeedController.value);
                bombSpeedController.value = (oldValue > 1) ? oldValue - 1 + "" : bombSpeedController.value;
                changeBombFrequency();
            }
            else if (code == "ArrowRight") {
                var oldValue = Number(bombSpeedController.value);
                bombSpeedController.value = (oldValue < 10) ? oldValue + 1 + "" : bombSpeedController.value;
                changeBombFrequency();
            }
            break;
        case IN_PAUSE:
            if (code == "Space") {
                changeState(IN_GAME);
            }
            break;
        case IN_DEAD:
            if (code == "Space")
                changeState(IN_GAME);
            break;
    }
}

// document.onkeyup = function (e) {
//     var code = e.code;
//     if (gameState == IN_GAME) {
//         if (code == "ShiftLeft") {
//             isPressed.shift = false;
//             console.log("Shift Released");
//         }
//         else if (code == "ArrowUp") {
//             isPressed.up = false;
//             if (isPressed.shift) {
//                 var oldValue = Number(bombSpeedController.value);
//                 bombSpeedController.value = (oldValue < 10) ? oldValue + 1 + "" : bombSpeedController.value;
//                 changeBombFrequency();
//             }
//             else {
//                 var oldValue = Number(ballSpeedController.value);
//                 ballSpeedController.value = (oldValue < 10) ? oldValue + 1 + "" : ballSpeedController.value;
//                 changeBallSpeed();
//             }
//         }
//         else if (code == "ArrowDown") {
//             isPressed.down = false;
//             if (isPressed.shift) {
//                 var oldValue = Number(bombSpeedController.value);
//                 bombSpeedController.value = (oldValue > 1) ? oldValue - 1 + "" : bombSpeedController.value;
//                 changeBombFrequency();
//             }
//             else {
//                 var oldValue = Number(ballSpeedController.value);
//                 ballSpeedController.value = (oldValue > 1) ? oldValue - 1 + "" : ballSpeedController.value;
//                 changeBallSpeed();
//             }
//         }
//     }
// }

function changeBallSpeed() {
    if (gameState == IN_PAUSE) return;
    ballMovingPerUpdate = ballSpeedController.value * 0.1;
    ballSpeedControllerLabel.innerHTML = "Ball Speed:" + ((ballSpeedController.value > 9) ? ballSpeedController.value : (" " + ballSpeedController.value));
}

function changeState(state) {
    switch (state) {
        case IN_GAME:
            if (gameState == IN_MENU || gameState == IN_DEAD) {
                balls.forEach(_ => {
                    _.style.width = ballSize.x + "%";
                    _.style.height = ballSize.y + "%";
                    _.style.left = 50 - ballSize.x + "%";
                    _.style.top = 50 - ballSize.y + "%";
                    _.style.visibility = "visible";
                    console.log(_);
                });
                currentBall0Pos.set_Pos(50 - ballSize.x, 50 - ballSize.y);
                lastStartedTime = Date.now();
                bombCount.innerHTML = "0";
                ballMovingPerUpdate = 0.1;
                bombsFrequency = 11000;
                ballMovingDegree = -37;
                ballSpeedController.value = 1;
                bombSpeedController.value = 1;
                ballSpeedControllerLabel.innerHTML = "Ball Speed: 1";
                bombSpeedControllerLabel.innerHTML = "Bomb Density: 1";
                bombs.forEach(_ => {
                    try {
                        document.body.removeChild(_.bomb);
                    }
                    catch { }
                });
                bombs = [];
            }
            else {
                balls.forEach(_ => {
                    _.style.opacity = "1";
                })
                bombs.forEach(_ => {
                    _.bomb.style.opacity = "1";
                })
            }
            if (gameState == IN_PAUSE) {
                ballSpeedController.disabled = false;
                bombSpeedController.disabled = false;
                // ballSpeedController.classList.toggle("ballSpeedSlider");
                // ballSpeedController.classList.toggle("ballSpeedSlider_inPause");
                set_speedSettingStyle(true, false);
                set_speedSettingStyle(true, true);
            }
            bar.style.visibility = "visible";
            bar.style.opacity = "1";
            title.style.visibility = "hidden";
            startButton.style.visibility = "hidden";
            ballSpeedControllerLabel.style.visibility = "visible";
            ballSpeedController.style.visibility = "visible";
            bombSpeedControllerLabel.style.visibility = "visible";
            bombSpeedController.style.visibility = "visible";
            timeDisplaying.style.visibility = "visible";
            timeDisplaying.style.opacity = "1";
            pauseButton.style.visibility = "visible";
            pausedLabel.style.visibility = "hidden";
            failedLabel.style.visibility = "hidden";
            restartButton.style.visibility = "hidden";
            break;
        case IN_PAUSE:
            balls.forEach(_ => {
                _.style.opacity = "0.4";
            })
            bombs.forEach(_ => {
                _.bomb.style.opacity = "0.4";
            })
            bar.style.opacity = "0.4";
            timeDisplaying.style.opacity = "0.4";
            startButton.style.visibility = "visible";
            pausedLabel.style.visibility = "visible";
            pauseButton.style.visibility = "hidden";
            gameState = IN_PAUSE;
            ballSpeedController.disabled = true;
            bombSpeedController.disabled = true;
            set_speedSettingStyle(false, false);
            set_speedSettingStyle(false, true);
            break;
        case IN_DEAD:
            balls.forEach(_ => {
                _.style.visibility = "hidden";
            })
            bombs.forEach(_ => {
                _.bomb.style.visibility = "hidden";
            })
            resultDurationTime.innerHTML = durationLabel.innerHTML + "&#10&#10";
            resultBombCount.innerHTML = bombCount.innerHTML;
            failedLabel.style.visibility = "visible";
            restartButton.style.visibility = "visible";
            pauseButton.style.visibility = "hidden";
            timeDisplaying.style.visibility = "hidden";
            ballSpeedController.style.visibility = "hidden";
            ballSpeedControllerLabel.style.visibility = "hidden";
            bombSpeedController.style.visibility = "hidden";
            bombSpeedControllerLabel.style.visibility = "hidden";
            bar.style.visibility = "hidden";
            break;
    }
    gameState = state;
}

function set_Mouse(e) {
    if (gameState == IN_PAUSE) return;
    bar.style.left = e.clientX - window.innerWidth * Number(bar.style.width.slice(0, 2)) / 200;
    if (bar.offsetLeft < 0)
        bar.style.left = 0;
    else if (bar.offsetLeft > boundaryOfBar) {
        bar.style.left = boundaryOfBar;
        console.log(boundaryOfBar);
    }
}

function set_speedSettingStyle(set = false, isBomb = false) {
    if (set) {
        if (!isBomb) {
            ballSpeedSetting.onmouseover = function () {
                ballSpeedSetting.style.opacity = "1";
            };
            ballSpeedSetting.onmouseout = function () {
                ballSpeedSetting.style.opacity = "0.4";
            };
            ballSpeedController.classList.add("speedSlider");
            ballSpeedController.classList.remove("speedSlider_inPause");
        }
        else {
            bombSpeedSetting.onmouseover = function () {
                bombSpeedSetting.style.opacity = "1";
            };
            bombSpeedSetting.onmouseout = function () {
                bombSpeedSetting.style.opacity = "0.4";
            };
            bombSpeedController.classList.add("speedSlider");
            bombSpeedController.classList.remove("speedSlider_inPause");

        }
    }
    else {
        if (!isBomb) {
            ballSpeedSetting.onmouseover = undefined;
            ballSpeedSetting.onmouseout = undefined;
            ballSpeedController.classList.remove("speedSlider");
            ballSpeedController.classList.add("speedSlider_inPause");
        }
        else {
            bombSpeedSetting.onmouseover = undefined;
            bombSpeedSetting.onmouseout = undefined;
            bombSpeedController.classList.remove("speedSlider");
            bombSpeedController.classList.add("speedSlider_inPause");
        }
    }
}

function generateBomb() {
    var element = document.createElement("img");
    element.src = "missile.png";
    element.id = "bomb_" + bombs.length;
    element.style = "position: absolute; visibility: visible;";
    element.style.zIndex = "100";
    element.style.width = 5 * multipleOfHW + "%";
    element.style.height = "15%";
    element.style.top = "-15%";
    element.style.left = Math.random() * (100 - 7.5 * multipleOfHW) + "%";
    document.body.appendChild(element);
    var bomb = new BOMB_AND_SPEED_t(element, bombsMovingPerUpdate);
    if (gameState == IN_GAME)
        setTimeout(commit_or_delay, 10, bomb, 1);
    else
        setTimeout(commit_or_delay, 10, bomb, Infinity);
}

function commit_or_delay(bomb, delayTimes) {
    console.log(Date.now());
    if (gameState != IN_GAME) {
        setTimeout(commit_or_delay, 10, bomb, Infinity);
    }
    else if (delayTimes) {
        setTimeout(commit_or_delay, Math.random() * bombsFrequency + 1000, bomb, 0);
    }
    else {
        bombs.push(bomb);
        setTimeout(generateBomb, 10);
    }
}

function changeBombFrequency() {
    if (gameState == IN_PAUSE) return;
    bombsFrequency = 11000 - bombSpeedController.value * 1000;
    bombSpeedControllerLabel.innerHTML = "Bomb Density:" + ((bombSpeedController.value > 9) ? bombSpeedController.value : (" " + bombSpeedController.value));
}

function show_about() {
    aboutContent.style.visibility = "visible";
}

function remove_about() {
    console.log("===fsd=fagadgsdf");
    aboutContent.style.visibility = "hidden";
}