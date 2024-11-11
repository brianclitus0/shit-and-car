const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const carWidth = 90;
const carHeight = 80;
const roadWidth = 400; // Tăng kích thước đường
const roadLeft = canvas.width / 2 - roadWidth / 2;
const roadRight = canvas.width / 2 + roadWidth / 2;
const obstacleWidth = 70;
const obstacleHeight = 70;
const car = { x: canvas.width / 2 - carWidth / 2, y: canvas.height - carHeight - 10 };
const obstacles = [];
let score = 0;
let bestScore = 0;
let speed = 5;
let gameOver = false;

const carImage = new Image();
carImage.src = 'img/car.png';

const obstacleImage = new Image();
obstacleImage.src = 'img/shit.png'; 

// Âm thanh
const engineSound = new Audio('sounds/car.mp3'); //
const crashSound = new Audio('sounds/shit.mp3');

document.addEventListener('keydown', keyDownHandler, false);
canvas.addEventListener('click', resetGame, false);

function keyDownHandler(e) {
    if (e.key == "ArrowLeft" && car.x > roadLeft) {
        car.x -= 14;
        playEngineSound();
    }
    if (e.key == "ArrowRight" && car.x < roadRight - carWidth) {
        car.x += 14;
        playEngineSound();
    }
    if (e.key == "ArrowUp" && car.y > canvas.height - 400) {
        car.y -= 5;
        playEngineSound();
    }
    if (e.key == "ArrowDown" && car.y < canvas.height - carHeight - 10) {
        car.y += 5;
        playEngineSound();
    }
}

function playEngineSound() {
    if (engineSound.paused) {
        engineSound.loop = true;  // Bật chế độ lặp cho âm thanh xe chạy
        engineSound.play();
    }
}

function stopEngineSound() {
    engineSound.pause();
    engineSound.currentTime = 0;
}

function drawCar() {
    ctx.drawImage(carImage, car.x, car.y, carWidth, carHeight);
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.drawImage(obstacleImage, obstacle.x, obstacle.y, obstacleWidth, obstacleHeight);
        obstacle.y += speed;
        
        if (obstacle.y > canvas.height) {
            score++;
            if (score > bestScore) 
                bestScore = score;
            
            obstacle.y = -obstacleHeight;
        }   

        if (
            car.x < obstacle.x + obstacleWidth - 30 &&
            car.x + carWidth - 30 > obstacle.x &&
            car.y < obstacle.y + obstacleHeight &&
            car.y + carHeight > obstacle.y
        ) {
            stopEngineSound();
            gameOver = true;
            crashSound.play();
        }
    });
}

function drawRoad() {
    ctx.fillStyle = '#808080';
    ctx.fillRect(roadLeft, 0, roadWidth, canvas.height);
}

function drawTrees() {
    const treeRadius = 16;
    const treeGap = 50;
    ctx.fillStyle = '#228B22'; // Màu xanh lá cây

    for (let i = 0; i < canvas.height / treeGap; i++) {
        let y = i * treeGap + treeRadius;
        ctx.beginPath();
        ctx.arc(roadLeft - treeRadius - 10, y, treeRadius, 0, Math.PI * 2);
        ctx.fill(); // Cây bên trái
        ctx.beginPath();
        ctx.arc(roadRight + treeRadius + 10, y, treeRadius, 0, Math.PI * 2);
        ctx.fill(); // Cây bên phải
    }
}

function drawRoadLine() {
    const lineWidth = 20;
    const lineHeight = 40;
    const lineGap = 60;
    ctx.fillStyle = '#ffffff'; // Màu trắng
    
    for (let i = 0; i < canvas.height / lineGap; i++) {
        let y = i * lineGap;
        ctx.fillRect(roadLeft * 2, y, lineWidth, lineHeight);
    }
}

function drawBestScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('Best Score: ' + bestScore, 10, 20);
}

function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('Score: ' + score, 10, 50);
}

function updateGame() {
    if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawTrees();
        drawRoad();
        drawRoadLine();
        drawCar();
        drawObstacles();
        drawScore();
        drawBestScore();
        requestAnimationFrame(updateGame);
    } else {
        stopEngineSound();
        ctx.font = '40px Arial';
        ctx.fillStyle = '#000000';
        ctx.fillText('Game Over\n', canvas.width / 2 - 100, canvas.height / 2);
        ctx.fillText(' Score: ' + score, canvas.width / 2 - 100, canvas.height / 2 + 50);
        console.log("game over");
    }
}

function resetGame() {
    if (gameOver) {
        car.x = canvas.width / 2 - carWidth / 2;
        car.y = canvas.height - carHeight - 10;
        obstacles.length = 0;
        score = 0;
        speed = 5;
        gameOver = false;
        stopEngineSound();
        updateGame();
        console.log("game reset");
    }
}

function addObstacle() {
    if (obstacles.length === 0 || obstacles[obstacles.length - 1].y > obstacleHeight * 3) {
        const obstacleX = roadLeft + Math.random() * (roadWidth - obstacleWidth);
        obstacles.push({
            x: obstacleX,
            y: -obstacleHeight
        });
    }
}

carImage.onload = () => {
    setInterval(addObstacle, 2000);
    updateGame();
};