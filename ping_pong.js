class POS2D_t {
    x;
    y;
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    set_Pos(x, y){
        this.x = Number(x);
        this.y = Number(y);
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
var movingPerUpdate = 0.1;
var widthOfBar = 20;
var heightOfBar = 5;
var boundaryOfBar;
var ballMovingDegree = -36;
/**
 * }
 */
var balls = [];
var bar;

/**
 * Speed controling group
 * {
 */
var speedController;
var speedControllerLabel;
var timeDisplaying;
/**
 * }
 */

/**
 * Duration label
 * {
 */
var durationLabel;
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
var currentPos = new POS2D_t(0, 0);
var nextPos = new POS2D_t(0, 0);
var ballSize = new POS2D_t(0, 0);
/* position of bar is set as (80, y) */
/**
 * }
 */

function degreeToGradian(degree) {
    return degree * Math.PI/180;
}

function normalizeDegree(degree) {
    if(degree > 180) {
        do { degree -= 360; } while(degree > 180);
    }
    else if(degree < -179) {
        do { degree += 360; } while(degree < -179);
    }
    return degree;
}

function willCollide(nextPos) {
    var crossingX = (80 - ballSize.y - currentPos.y) / (nextPos.y - currentPos.y) * (nextPos.x - currentPos.x) + currentPos.x;
    console.log("[Crossing X]", crossingX);
    
    if(bar.offsetLeft <= crossingX * window.innerWidth / 100 && bar.offsetLeft + widthOfBar * window.innerWidth / 100 > crossingX  * window.innerWidth / 100)
        return true;
    return false;
}

function start() {
    multipleOfHW = window.innerHeight / window.innerWidth;

    speedController = document.getElementById("speedSlider");
    speedControllerLabel = document.getElementById("speedSettingLabel");
    timeDisplaying = document.getElementById("timeDisplaying");

    fontSize = window.innerHeight / 929 * 2 + "em";
    speedControllerLabel.style.fontSize = fontSize;
    timeDisplaying.style.fontSize = fontSize;
    durationLabel = document.getElementById("durationTime");
    durationLabel.innerHTML = "0.00";    
    lastStartedTime = Date.now();
    
    startButton = document.getElementById("start");
    startButton.style.height = "20%";
    startButton.style.width = 20*multipleOfHW + "%";
    startButton.style.top = 50-10 + "%";
    startButton.style.left = 50-10*multipleOfHW + "%";
    startButton.style.visibility = "visible";

    title = document.getElementById("title");
    title.style.height = "20%";
    title.style.width = 50*multipleOfHW + "%";
    title.style.top = "60%";
    title.style.left = 50-25*multipleOfHW + "%";
    title.style.visibility = "visible";

    document.body.style.cursor = "none";

    bar = document.getElementById("bar");
    document.addEventListener("mousemove", set_Mouse)
    bar.style.top = "80%";
    bar.style.left = "50%";
    bar.style.height = heightOfBar + "%";
    bar.style.width = widthOfBar + "%";
    boundaryOfBar = Math.round(window.innerWidth * (1 - widthOfBar / 100), 0);
    
    ballSize.set_Pos(BALL_SIZE*multipleOfHW, BALL_SIZE);
    for(var i = 0; i < 5; i ++) {
        balls.push(document.getElementById("ball" + i));
    }
    balls[4].style.visibility = "visible";
    balls[4].style.width = ballSize.x + "%";
    balls[4].style.height = ballSize.y + "%";
    balls[4].style.left = "0%";
    balls[4].style.top = "0%";
    currentPos.set_Pos(0, 0);
    movingPerUpdate = 1;
    
    pauseButton = document.getElementById("pause");
    pauseButton.style.height = "10%";
    pauseButton.style.width = 10*multipleOfHW + "%";
    pauseButton.style.top = "2.5%";
    pauseButton.style.left = "2.5%";
    pauseButton.style.visibility = "hidden";

    pausedLabel = document.getElementById("paused_label");
    pausedLabel.style.height = "20%";
    pausedLabel.style.width = 50*multipleOfHW + "%";
    pausedLabel.style.top = "60%";
    pausedLabel.style.left = 50-25*multipleOfHW + "%";
    pausedLabel.style.visibility = "hidden";

    setTimeout(function(){
        update(Infinity);
        // update(0);
    }, 10);
} 

function update(times) {
    if(!times) return;
    
    else if(gameState == IN_MENU){
        nextPos.set_Pos(
            currentPos.x - movingPerUpdate * Math.sin(degreeToGradian(ballMovingDegree)),
            currentPos.y + movingPerUpdate * Math.cos(degreeToGradian(ballMovingDegree)) / multipleOfHW
        );
        console.log("--------------" + times);
        console.log(nextPos);
        if(nextPos.x > 100 - ballSize.x){
            nextPos.x = (100 - ballSize.x) * 2 - nextPos.x;
            ballMovingDegree = - ballMovingDegree;
        }
        else if(nextPos.x < 0){
            nextPos.x = -nextPos.x;
            ballMovingDegree = - ballMovingDegree;
        }
        if(nextPos.y > 100){
            gameState = IN_DEAD;
        }
        else if(nextPos.y > 100 - ballSize.y){
            nextPos.y = (100 - ballSize.y) * 2 - nextPos.y;
            ballMovingDegree = - (ballMovingDegree + 90) - 90;
        }
        else if(nextPos.y < 0){
            nextPos.y = -nextPos.y;
            ballMovingDegree = - (ballMovingDegree + 90) - 90;
        }
    
        balls[4].style.left = nextPos.x + "%";
        balls[4].style.top = nextPos.y + "%";
        currentPos.set_Pos(nextPos.x, nextPos.y);
    }
    else if(gameState == IN_GAME){
        for(var i = 4; i > 0; i --){
            balls[i].style.left = balls[i - 1].offsetLeft;
            balls[i].style.top = balls[i - 1].offsetTop;
        }
        nextPos.set_Pos(
            currentPos.x - movingPerUpdate * Math.sin(degreeToGradian(ballMovingDegree)),
            currentPos.y + movingPerUpdate * Math.cos(degreeToGradian(ballMovingDegree)) / multipleOfHW
        );
        console.log("--------------" + times);
        console.log(nextPos);
        if(nextPos.x > 100 - ballSize.x){
            nextPos.x = (100 - ballSize.x) * 2 - nextPos.x;
            ballMovingDegree = - ballMovingDegree;
        }
        else if(nextPos.x < 0){
            nextPos.x = -nextPos.x;
            ballMovingDegree = - ballMovingDegree;
        }
        if(nextPos.y > 100){
            gameState = IN_DEAD;
        }
        else if(nextPos.y + ballSize.y >80 && currentPos.y + ballSize.y < 80 && willCollide(nextPos)){
            nextPos.y = (80 - ballSize.y) * 2 - nextPos.y;
            ballMovingDegree = - (ballMovingDegree + 90) - 90;
        }
        else if(nextPos.y < 0){
            nextPos.y = -nextPos.y;
            ballMovingDegree = - (ballMovingDegree + 90) - 90;
        }
    
        balls[0].style.left = nextPos.x + "%";
        balls[0].style.top = nextPos.y + "%";
        currentPos.set_Pos(nextPos.x, nextPos.y);
    
        ballMovingDegree = normalizeDegree(ballMovingDegree);
        balls.forEach(_ => console.log(_));
       
    }
    if(gameState == IN_GAME) durationLabel.innerHTML = (Date.now() - lastStartedTime) / 1000;
    else lastStartedTime = Date.now() - Number(durationLabel.innerHTML) * 1000;
    console.log(lastStartedTime);
    setTimeout(function(){
        update(--times);
    }, 10);
}

window.onresize = function(){
    multipleOfHW = window.innerHeight / window.innerWidth;
    console.log(multipleOfHW);
    ballSize.set_Pos(BALL_SIZE * multipleOfHW, BALL_SIZE);
    balls.forEach(_ => {
        _.style.width = ballSize.x+ "%";
        _.style.height = ballSize.y + "%";
    });
    fontSize = window.innerHeight / 929 * 2 + "em";
    speedControllerLabel.style.fontSize = fontSize;
    timeDisplaying.style.fontSize = fontSize;
    boundaryOfBar = Math.round(window.innerWidth * (1 - widthOfBar / 100), 0);
    startButton.style.height = "20%";
    startButton.style.width = 20*multipleOfHW + "%";
    startButton.style.top = 50-10 + "%";
    startButton.style.left = 50-10*multipleOfHW + "%";
}

function changeSpeed() {
    movingPerUpdate = speedController.value * 0.1;
    speedControllerLabel.innerHTML = speedControllerLabel.innerHTML.slice(0, 6) + ((speedController.value > 9) ? speedController.value : (" " + speedController.value));
}

function changeState(state){
    switch(state){
        case IN_GAME:
            if(gameState == IN_MENU) {
                balls.forEach(_ => {
                    _.style.width = ballSize.x + "%";
                    _.style.height = ballSize.y + "%";
                    _.style.left = 50 - ballSize.x +"%";
                    _.style.top = 50 - ballSize.y +"%";
                    _.style.visibility = "visible";
                    console.log(_);
                });
                currentPos.set_Pos(50 - ballSize.x, 50 - ballSize.y);
                lastStartedTime = Date.now();
                movingPerUpdate = 0.1;
                ballMovingDegree = -37;
            }
            else {
                balls.forEach(_ => {
                    _.style.opacity = "1";
                })
            }
            bar.style.visibility = "visible";
            title.style.visibility = "hidden";
            startButton.style.visibility = "hidden";
            document.body.style.cursor = "none";
            speedControllerLabel.style.visibility = "visible";
            speedController.style.visibility = "visible";
            timeDisplaying.style.visibility = "visible";
            pauseButton.style.visibility = "visible";
            pausedLabel.style.visibility = "hidden";
            break;
        case IN_PAUSE:
            balls.forEach(_ => {
                _.style.opacity = "0.4";
            })
            startButton.style.visibility = "visible";
            pausedLabel.style.visibility = "visible";
            pauseButton.style.visibility = "hidden";
            break;
    }
    gameState = state;
}

function set_Mouse(e) {
    bar.style.left = e.clientX - window.innerWidth * Number(bar.style.width.slice(0, 2)) / 200;
    if(bar.offsetLeft < 0)
        bar.style.left = 0;
    else if(bar.offsetLeft > boundaryOfBar)  {
        bar.style.left = boundaryOfBar;
        console.log(boundaryOfBar);
    }
}