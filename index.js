const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const retryBtn = document.getElementById("retry");

let highScore = 0;
let interValID = 0;

const scale = 10;
const rows = canvas.height / scale;
const cols = canvas.width / scale;


//Display the end menu angd hide menu
function showEndMenu() {
    let end_game_score = document.getElementById("end-game-score");
    document.getElementById("end-game-menu").style.display = 'block';
    end_game_score.innerHTML = scoreEl.innerHTML;

    if (highScore < end_game_score.innerHTML) {
        highScore = end_game_score.innerHTML;
    }
    document.getElementById("high-score").innerHTML = highScore;

    snake.total = 0;
    snake.tail = [];
}

function hideEndMenu() {
    document.getElementById("end-game-menu").style.display = 'none';
}


//Here we run the game
function loop() {
    fruit.pickLocation();

    interValID = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        snake.update((''))
        snake.draw();
        fruit.draw();

        if (snake.eat(fruit)) {
            fruit.pickLocation();
            updateScore();
            snake.draw();
        }
        snake.checkCollision();
    }, 120)
}

//We will need something update score
function updateScore() {
    scoreEl.innerHTML = snake.total;
}

class Snake {
    constructor() {
        this.x = 0;
        this.y = 0;

        this.xSpeed = scale;
        this.ySpeed = 0;
        // Total fruits the snake eaten
        this.total = 0;
        this.tail = [];
    }

    //Here we draw snake
    draw() {
        ctx.fillStyle = "#FFFFFF";

        for (let i = 0; i < this.tail.length; i++) {
            ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
        }
        ctx.fillRect(this.x, this.y, scale, scale);
    }

    //Update snake
    update() {
        for (let i = 0; i < this.tail.length - 1; i++) {
            this.tail[i] = this.tail[i + 1];
        }
        this.tail[this.total - 1] = { x: this.x, y: this.y };

        this.x += this.xSpeed;
        this.y += this.ySpeed;

        if (this.x > canvas.width - scale) {
            this.x = 0;
        }

        if (this.x < 0) {
            this.x = canvas.width - scale;
        }

        if (this.y > canvas.height - scale) {
            this.y = 0;
        }

        if (this.y < 0) {
            this.y = canvas.height - scale;
        }
    }

    changeDirection(direction) {
        switch (direction) {
            case "up":
                this.xSpeed = 0;
                this.ySpeed = -scale;
                break;
            case "down":
                this.xSpeed = 0;
                this.ySpeed = scale;
                break;
            case "left":
                this.xSpeed = -scale;
                this.ySpeed = 0;
                break;
            case "right":
                this.xSpeed = scale;
                this.ySpeed = 0;
                break;
        }
    }

    //Here the snake eats the fruit
    eat(fruit) {
        if (this.x === fruit.x && this.y === fruit.y) {
            this.total++;
            return true;
        } else {
            return false;
        }
    }

    checkCollision() {
        for (let i = 0; i < this.tail.length; i++) {
            if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
                showEndMenu();
                updateScore();
                clearInterval(interValID);
            }
        }
    }
}

class Fruit {
    constructor() {
        this.x;
        this.y;
    }

    pickLocation() {
        this.x = (Math.floor(Math.random() * cols)) * scale;
        this.y = (Math.floor(Math.random() * rows)) * scale;
    }

    draw() {
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(this.x, this.y, scale, scale);
    }
}

function addListener() {
    document.addEventListener('keydown', (event) => {
        switch (event.code) {
            case "ArrowUp":
                snake.changeDirection("up");
                break;
            case "ArrowDown":
                snake.changeDirection("down");
                break;
            case "ArrowLeft":
                snake.changeDirection("left");
                break;
            case "ArrowRight":
                snake.changeDirection("right");
                break;
        }
    });
    retryBtn.addEventListener('click', () => {
        hideEndMenu();
        loop();
    });
}

let snake = new Snake();
let fruit = new Fruit();
addListener();

window.onload = () => {
    loop();
}