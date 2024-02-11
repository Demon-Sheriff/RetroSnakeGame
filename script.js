
// We will catch some html elements that we will manipulate.
let board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScore = document.getElementById('highScore');
const mainCont = document.querySelector('.main-container');
const userCont = document.querySelector('.user-controller');
const gameover = document.querySelector('.game-over');

// catching arrow buttons displayed in the UI
const upKey = document.getElementById('up');
const downKey = document.getElementById('down');
const rightKey = document.getElementById('right');
const leftKey = document.getElementById('left');

let currscoreNum = 0;
let highscoreNum = 0;
let snake = [{x:10,y:10}]; // snake is an array of a pair which is x and y coordinates.
let food_position = generateFood();
let direction = 'right'; // by default keeping the direction to the right.
let gameInterval;
let gameSpeedDelay = 400; // starting game speed is 200 milliseconds
let gameStarted = false;

// function to get random co-ordinates
function getRandomCoordinates(){
    return Math.floor(Math.random() * 20) + 1;
}

// Draw game map, snake, food
function draw(){
    board.innerHTML = '';
    createSnake();
    createFood();
}

// generate a random coordinate for the food and make sure that the food does not appear in the body of the snake
function generateFood() {
    let newFoodPosition;
    do {
        newFoodPosition = { x: getRandomCoordinates(), y: getRandomCoordinates() };
    } while (isFoodOnSnake(newFoodPosition));
    return newFoodPosition;
}

function isFoodOnSnake(foodPos) {
    return snake.some(segment => segment.x === foodPos.x && segment.y === foodPos.y);
}

// Create the Snake
function createSnake(){
    // for each element of the snake array

    snake.forEach((snake_segment) =>{
        // since we are using the foreach method in js this means that 
        // snake_segment will represent each and every element of the snake array 
        const snakeElement = createGameElement('div','snake');

        setPosition(snakeElement,snake_segment);
        board.appendChild(snakeElement);
    });

}

// this function will make the snake or the food visual
// it will turn the backend data structures into visual html elements.
function createGameElement(html_tag,className){
    // create a new element with the html_tag (a div in case of the snake)
    const element = document.createElement(html_tag);
    // set the class of the created element as the input class 
    // for example if we create a div for the snake then put its className as snake
    element.className = className;

    return element;
}


// this function will set the position of the snake or the food.
function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

// creating the food
function createFood(){
    if(gameStarted){
        const foodElement = createGameElement('div','food');
        setPosition(foodElement,food_position);
        board.appendChild(foodElement);
    }
}

// Alright! now we are going to implement how to move our snake.
function moveSnake(){
    // creating a copy of the head of the snake
    const head = { ...snake[0] };

    // using switch case to move the copy of the head
    switch (direction){
        case 'up':
            head.y = (head.y - 1); // Use modulo to wrap around the board
            break;
        case 'down':
            head.y = (head.y + 1);
            break;
        case 'left':
            head.x = (head.x - 1);
            break;
        case 'right':
            head.x = (head.x + 1);
            break;
    }

    // now append the copy after the swtich case to the original snake array
    snake.unshift(head);

    if(head.x === food_position.x && head.y === food_position.y){
        // put the food block somewhere else
        food_position = generateFood();

        // update the current score
        currscoreNum = snake.length - 1;
        score.textContent = `Score ${currscoreNum.toString().padStart(4,'0')}`;

        // if the current score exceeds the high score update it
        if(currscoreNum > highscoreNum){
            highscoreNum = currscoreNum;
            highScore.textContent = `High Score ${highscoreNum.toString().padStart(4,'0')}`;
        }

        increaseSpeed();
        // clear the past interval
        clearInterval(gameInterval);

        // when the snake eats the food , change the current speed of the game and increment it.
        gameInterval = setInterval(() => {
            moveSnake();
            checkCollision();
            draw();
        },gameSpeedDelay);

        // increment size of snake array by 1
        // so to achieve this do not pop the tail of the snake when it eats the food.
    }
    // if the snake does not eat the food keep popping the tail so that its size doesnt increase.
    else snake.pop();
}

// Implementing the Start game function
function startGame(){

    gameStarted = true; // Keep track of the running game
    if(gameStarted){
        instructionText.style.display = 'none';
        logo.style.display = 'none';
    }

    gameInterval = setInterval(() => {
        // move the snake
        moveSnake();

        // check if the snake has collided to a wall
        checkCollision();

        //call the draw function to display the food and the snake
        draw();
    }, gameSpeedDelay);

}

// creating a key press event listener to start the game when space bar is pressed

function handlekeyPress(event){

    // if the game has not started yet start the game !
    if((!gameStarted  && event.code === 'Space') || (!gameStarted  && event.key === ' ')){
        startGame();
    }
    else{
        // the game has already started so now handle the function of the arrow keys
        switch(event.key){
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
        }
    }
}

// function to check collision

function checkCollision(){
    const head = snake[0];

    // the snake hits the walls
    if(head.x < 1 || head.x > 20 || head.y < 1 || head.y > 20){
        // reset the game.
        resetGame();
        gameStarted = false;
    }

    // check if the snake head has collided by its body
    for(let i=1; i<snake.length; i++){
        if(head.x === snake[i].x && head.y === snake[i].y){
            // reset the game.
            resetGame();
            gameStarted = false;
        }
    }
}

// function to reset the game
function resetGame(){
    // reset the game properties
    updateScore();
    stopGame();
    snake = [{x:10,y:10}];
    food_position = generateFood();
    direction = 'right';
    gameSpeedDelay = 400;

}

// function to update the gameScore
function updateScore(){
    let currScore = snake.length - 1;
    // reset the current score to be zero
    score.textContent = `Score 0000`;
    highscoreNum = Math.max(highscoreNum,currScore);
    highScore.textContent = `High Score ${highscoreNum.toString().padStart(4,'0')}`;
    highScore.style.display = 'block';
}

// function to stop the game
function stopGame(){
    if(!gameStarted){
        instructionText.style.display = 'block';
        logo.style.display = 'block';
    }
    clearInterval(gameInterval);
    gameStarted = false;
}

// function to increase the game speed
function increaseSpeed() {
    //   console.log(gameSpeedDelay);
    if (gameSpeedDelay > 150) gameSpeedDelay -= 5;
    else if(gameSpeedDelay > 100) gameSpeedDelay -= 3;
    else if(gameSpeedDelay > 50) gameSpeedDelay -= 2
    else if(gameSpeedDelay > 25) gameSpeedDelay -= 1;
}

// now add the keypress eventlistener to the DOM !
document.addEventListener('keydown',handlekeyPress);

// Add click event listeners to the UI elements
upKey.addEventListener('click', () => changeDirection('up'));
downKey.addEventListener('click', () => changeDirection('down'));
rightKey.addEventListener('click', () => changeDirection('right'));
leftKey.addEventListener('click', () => changeDirection('left'));

// Function to change direction based on button click
function changeDirection(newDirection) {

    // if the game has not started yet start the game
    if(!gameStarted){
        gameStarted = true;
        startGame();
    }
    // Add any additional logic if needed
    direction = newDirection;
}


