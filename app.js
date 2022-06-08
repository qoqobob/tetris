document.addEventListener('DOMContentLoaded', () => {
const grid = document.querySelector('.grid')
let squares = Array.from(document.querySelectorAll('.grid div'))
const miniGrid = document.querySelectorAll('.grid-mini div')
const StartBtn = document.getElementById('start-button')
const moveLeftButton = document.getElementById('move-left-button')
const moveRightButton = document.getElementById('move-right-button')
const moveDownButton = document.getElementById('move-down-button')
const rotateButton = document.getElementById('rotate-button')
let displayScore = document.getElementById('score')
let scoreHeader = document.getElementById('score-header')
const width = 10
const miniWidth = 4

StartBtn.disabled = false
moveDownButton.disabled = false
rotateButton.disabled = false
moveLeftButton.disabled = false
moveRightButton.disabled = false

//The Tetraminoes
const lTetramino = [
    [1, width + 1, 2 * width + 1, 2 * width + 2],
    [width, width + 1, width + 2, 2 * width],
    [0, 1, width + 1, 2 * width + 1],
    [2, width, width + 1, width + 2]
]
const llTetramino = [
    [1, width + 1, 2 * width, 2 * width + 1],
    [0, width, width + 1, width + 2],
    [1, 2, width + 1, 2 * width + 1],
    [0, 1, 2, width + 2]
]
const sTetramino = [
    [0, width, width + 1, 2 * width +1],
    [1, 2, width, width + 1],
    [0, width, width + 1, 2 * width +1],
    [1, 2, width, width + 1]
]
const ssTetramino = [
    [1, width, width + 1, 2 * width],
    [0, 1, width + 1, width + 2],
    [1, width, width + 1, 2 * width],
    [0, 1, width + 1, width + 2]
]
const tTetramino = [
    [1, width, width + 1, width + 2],
    [0, width, width + 1, 2 * width],
    [0, 1, 2, width + 1],
    [1, width, width + 1, 2 * width + 1]
]
const ttTetramino = [
    [0, 1, 2, width + 1],
    [1, width, width + 1, 2 * width + 1],
    [1, width, width + 1, width + 2],
    [0, width, width + 1, 2 * width]
]
const oTetramino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
]
const ooTetramino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
]
const iTetramino = [
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, 2 * width + 1, 3 * width + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, 2 * width + 1, 3 * width + 1]
]
const iiTetramino = [
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, 2 * width + 1, 3 * width + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, 2 * width + 1, 3 * width + 1]
]
const tetraminoes = [lTetramino, llTetramino, sTetramino, ssTetramino, tTetramino, ttTetramino, oTetramino, ooTetramino, iTetramino, iiTetramino]

// Displayed tetris figures
const displayTetraminoes = [
    [miniWidth, miniWidth + 1, miniWidth + 2, 2 * miniWidth],
    [0, miniWidth, miniWidth + 1, miniWidth + 2],
    [1, 2, miniWidth, miniWidth + 1],
    [0, 1, miniWidth + 1, miniWidth + 2],
    [1, miniWidth, miniWidth + 1, miniWidth + 2],
    [0, 1, 2, miniWidth + 1],
    [0, 1, miniWidth, miniWidth + 1],
    [0, 1, miniWidth, miniWidth + 1],
    [miniWidth, miniWidth + 1, miniWidth + 2, miniWidth + 3],
    [miniWidth, miniWidth + 1, miniWidth + 2, miniWidth + 3]
]

let shouldFreeze = false
let score = 0
displayScore.innerHTML = score
let timeInterval = 500
let currentRow = 0
let currentColumn = 4
let currentPosition = currentColumn + currentRow

let nextRandom = Math.floor(Math.random() * displayTetraminoes.length)
let random = Math.floor(Math.random() * tetraminoes.length)
let randomRotation = Math.floor(Math.random() * tetraminoes[random].length)
let currentTetramino = tetraminoes[random][randomRotation]
fastRun = null

// Draws a tetis random figure
function draw() {
    for (eachSquare in currentTetramino) {
        if (currentPosition + currentTetramino[eachSquare] >= 0) {
            squares[currentPosition + currentTetramino[eachSquare]].classList.add(`tetramino${random}`)
        }
    }
}
// Deletes a tetris figure
function undraw() {
    for (eachSquare in currentTetramino) {
        if (currentPosition + currentTetramino[eachSquare] >= 0) {
            squares[currentPosition + currentTetramino[eachSquare]].classList.remove(`tetramino${random}`)
        }
    }
}
// Sets borders of the play screen 
function playScreenBorders() {
    for (square in squares) {
        if (square > 239) {
            squares[square].classList.add('taken')
            squares[square].classList.add('hidden')
        }
    }
    for (square in squares) {
        if (square < 40) {
            squares[square].classList.add('hidden')
        }
    }
}
// Moves a tetris figure down every second
function moveDown() {
    freeze()
    freeze2()
    undraw()
    currentPosition += width
    checkBeforeRotate()
    draw()
    gameOver()
    removeComplitedRow()
}
// Freezes a tetris figure
function freeze() {
    shouldFreeze = false
    for (eachSquare in currentTetramino) {
        if (squares[currentPosition + currentTetramino[eachSquare] + width].classList.contains('taken')) {
            shouldFreeze = true
        }
    }
    if(shouldFreeze) {
        clearInterval(fastRun)
    }
} 
// Freezes a tetris figure and throws next one
function freeze2() {
    if (shouldFreeze) {
        for (eachSquare in currentTetramino) {
        squares[currentPosition + currentTetramino[eachSquare]].classList.add('taken')
        }
        // Drops a new tetris figure
        currentPosition = 4
        random = nextRandom
        nextRandom = Math.floor(Math.random() * displayTetraminoes.length)
        randomRotation = Math.floor(Math.random() * tetraminoes[random].length)
        currentTetramino = tetraminoes[random][randomRotation]
        draw()
        displayNextFigure()
    } 
} 

// Drops a tetris figure fast down
function drop() {    
    if (!(scoreHeader.innerHTML == 'Game over!')) {
        fastRun = setInterval(moveDown, 20)
        moveDownButton.disabled = true
        setTimeout(()=>{
            moveDownButton.disabled = false;
        }, 510)  
    }
}
// Moves a tetris figure left with the button
function moveLeft() {
    undraw()
    let shouldMoveLeft = true
    for (eachSquare in currentTetramino) {
        if ((currentPosition + currentTetramino[eachSquare]) % 10 === 0) {
            shouldMoveLeft = false
        }
    }
    if (shouldMoveLeft) {
        currentPosition -= 1
    }
    let shouldNotMoveLeft = false
    for (eachSquare in currentTetramino) {
        let index = currentPosition + currentTetramino[eachSquare]
        if (squares[index].classList.contains('taken')) {
            shouldNotMoveLeft = true
        }
    }
    if (shouldNotMoveLeft) {
        currentPosition += 1
    }
    draw()
}
// Moves a tetris figure right with the button
function moveRight() {
    undraw()
    let shouldMoveRight = true
    for (eachSquare in currentTetramino) {
        if ((currentPosition + currentTetramino[eachSquare]) % 10 === 9) {
            shouldMoveRight = false
        }
    }
    if (shouldMoveRight) {
        currentPosition += 1
    }
    let shouldNotMoveRight = false
    for (eachSquare in currentTetramino) {
        let index = currentPosition + currentTetramino[eachSquare]
        if (squares[index].classList.contains('taken')) {
            shouldNotMoveRight = true
        }
    }
    if (shouldNotMoveRight) {
        currentPosition -= 1
    }
    draw()    
}
// Rotates a tetris figure clockwise
function rotate() {
    undraw()
    randomRotation += 1
    if (randomRotation === 4) {
        randomRotation = 0
    }
    currentTetramino = tetraminoes[random][randomRotation]
    //prevents a tetris figure to cross left and right screen border
    let rotatedTetramino = [(currentPosition + currentTetramino[0]) % 10, (currentPosition +currentTetramino[1]) % 10, (currentPosition +currentTetramino[2]) % 10, (currentPosition +currentTetramino[3]) % 10]
    while (rotatedTetramino.includes(0) && rotatedTetramino.includes(9)) {
        if (currentPosition % 10 === 8 || currentPosition % 10 === 7) {
            // undraw()
            currentPosition -=1
        }
        if (currentPosition % 10 === 9) {
            // undraw()
            currentPosition +=1
        }
        rotatedTetramino = [(currentPosition + currentTetramino[0]) % 10, (currentPosition +currentTetramino[1]) % 10, (currentPosition +currentTetramino[2]) % 10, (currentPosition +currentTetramino[3]) % 10]
    }
    draw()
}
// Prevents rotation a tetris figure if it overlaps freezed figures
function checkBeforeRotate() {
    rotateButton.disabled = false
    let checkRotation = randomRotation + 1
    if (checkRotation === 4) {
        checkRotation = 0
    }
    let checkTetramino = tetraminoes[random][checkRotation]
    for (eachSquare in checkTetramino) {
        let index = currentPosition + checkTetramino[eachSquare]
        if (squares[index].classList.contains('taken')) {
            rotateButton.disabled = true
        }
    }
}
// Removes completed row and updates the score
function removeComplitedRow() {
    for (let j = 40; j <= 230; j+=10) {
        let isRowCompleted = true
        for (let i = 0; i < 10; i++) {
            if (!squares[j + i].classList.contains('taken')) {
                isRowCompleted = false
            }
        }
        if (isRowCompleted) {
            for (i = 0; i < 10; i++) {
                squares[j + i].classList.remove('taken')                
                squares[j + i].classList.remove('tetramino0')
                squares[j + i].classList.remove('tetramino1')
                squares[j + i].classList.remove('tetramino2')
                squares[j + i].classList.remove('tetramino3')
                squares[j + i].classList.remove('tetramino4')
                squares[j + i].classList.remove('tetramino5')
                squares[j + i].classList.remove('tetramino6')
                squares[j + i].classList.remove('tetramino7')
                squares[j + i].classList.remove('tetramino8')
                squares[j + i].classList.remove('tetramino9')
                squares[30 + i].classList.remove('hidden')
            }

            let removedRow = squares.splice(j, width)   
            squares = removedRow.concat(squares)            
            for (square in squares) {
                grid.appendChild(squares[square])
            }
            for (i = 0; i < 10; i++) {
                squares[i].classList.add('hidden')                
            }
            score += 10
            displayScore.innerHTML = score
        }
    }
}
// Stops the game
function gameOver() {
    for (let i = 40; i < 50; i++) {
        if (squares[i].classList.contains('taken')) {
            clearInterval(runGame)
            scoreHeader.innerHTML = 'Game over!'
            StartBtn.disabled = true
            moveDownButton.disabled = true
            rotateButton.disabled = true
            moveLeftButton.disabled = true
            moveRightButton.disabled = true
        }
    }
}
// Pauses the game
function gamePause() {
    if (runGame) {
        clearInterval(fastRun) //pauses when a tetris figure is fast falling
        clearInterval(runGame)
        runGame = null
        StartBtn.innerHTML = 'Unpause'
        moveDownButton.disabled = true
        rotateButton.disabled = true
        moveLeftButton.disabled = true
        moveRightButton.disabled = true
    } else {
        runGame = setInterval(moveDown, timeInterval)
        StartBtn.innerHTML = 'Play/pause'
        moveDownButton.disabled = false
        rotateButton.disabled = false
        moveLeftButton.disabled = false
        moveRightButton.disabled = false
    }    
}
// Displays next tetris figure
function displayNextFigure() {
    //Undraws entire mini grid
    for (let i = 0; i < 10; i++ ) {
        miniGrid[i].classList.remove('tetramino0')
        miniGrid[i].classList.remove('tetramino1')
        miniGrid[i].classList.remove('tetramino2')
        miniGrid[i].classList.remove('tetramino3')
        miniGrid[i].classList.remove('tetramino4')
        miniGrid[i].classList.remove('tetramino5')
        miniGrid[i].classList.remove('tetramino6')
        miniGrid[i].classList.remove('tetramino7')
        miniGrid[i].classList.remove('tetramino8')
        miniGrid[i].classList.remove('tetramino9')
    }
    // Draws next tetris figure
    for (eachSquare in displayTetraminoes[nextRandom]) {
        miniGrid[displayTetraminoes[nextRandom][eachSquare]].classList.add(`tetramino${nextRandom}`)
    }
}

playScreenBorders()
displayNextFigure() 
moveLeftButton.addEventListener('click', moveLeft)
moveRightButton.addEventListener('click', moveRight)
rotateButton.addEventListener('click', rotate)
moveDownButton.addEventListener('click', drop)
StartBtn.addEventListener('click', gamePause)

moveLeftButton.addEventListener('dblclick', moveLeft)
moveRightButton.addEventListener('dblclick', moveRight)
rotateButton.addEventListener('dblclick', rotate)
moveDownButton.addEventListener('dblclick', drop)
StartBtn.addEventListener('dblclick', gamePause)

runGame = setInterval(moveDown, timeInterval)
})