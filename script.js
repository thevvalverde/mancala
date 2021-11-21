const $ = (selector) => document.getElementById(selector);

//        Click listeners

$("button-tutorial").addEventListener('click', showTutorial);
$("close-tutorial").addEventListener('click', showTutorial);
$("button-classification").addEventListener('click', displayClassification);
$("close-classification").addEventListener('click', closeClassification);
$("start").addEventListener('click', () => {
    startGame(false)
});
$("pc-start").addEventListener('click', () => {
    startGame(true)
});
$("pc-checkbox").addEventListener('change', display);
$("quit").addEventListener('click', quitGame);
//$("lower-row"),addEventListener('hoverOnLowerRow', false);
//$("lower-row"),addEventListener('hoverOutLowerRow', false);
//$("upper-row"),addEventListener('hoverOnUpperRow', false);
//$("upper-row"),addEventListener('hoverOutUpperRow', false);

//      General Animations

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function fade(element) {
    var op = 1;
    var timer = setInterval(function () {
        if (op <= 0.1) {
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 10);
}

function unfade(element) {
    var op = 0.1;
    element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1) {
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 10);
}

// GAME VARIABLES ***************

let playerTwoTurn = false;
let gameOver = false;
let seedArray;
let classifications = [];
let n;

// ******************************

// GAME UPDATES *****************

function updateGame() {
    updateBoard();
    updateStatus();
    updateScore();
}

function updateScore() {

    let scoreOne = $("p1-score");
    let scoreTwo = $("p2-score");

    scoreOne.innerHTML = 'Seeds: ' + seedArray[n];
    scoreTwo.innerHTML = 'Seeds: ' + seedArray[2 * n + 1];
}

function updateBoard() {

    for (let i = 0; i < seedArray.length; i++) {
        let curr = seedArray[i];
        // console.log('inserting ' + curr + ' seeds in ' + i);
        if (i === n) {
            let p1Cav = $('right-container');
            if (p1Cav.childElementCount != curr) {
                p1Cav.textContent = '';
                generateSeeds(p1Cav, curr);
            }
        } else if (i === 2 * n + 1) {
            let p2Cav = $('left-container');
            if (p2Cav.childElementCount != curr) {
                p2Cav.textContent = '';
                generateSeeds(p2Cav, curr);
            }
        } else if (i < n) {
            let p1Hole = $('lower-hole-' + i);
            if (p1Hole.childElementCount != curr) {
                p1Hole.textContent = '';
                generateSeeds(p1Hole, curr);
            }
            // console.log("looking for " + p1Hole.id);
        } else {
            let p2Hole = $('upper-hole-' + (i - (n + 1)));
            if (p2Hole.childElementCount != curr) {
                p2Hole.textContent = '';
                generateSeeds(p2Hole, curr);
            }
            // console.log("looking for " + p2Hole.id);
        }
    }

}

function updateStatus() {
    let statusOne = $("player-one-status");
    let statusTwo = $("player-two-status");
    let upperRow = document.getElementById('upper-row');
    let lowerRow = document.getElementById('lower-row');

    for(let i = 0; i < n; i++) {
        $('upper-hole-'+i).classList.remove("hole-current");
        $('lower-hole-'+i).classList.remove("hole-current");
    }

    if (!playerTwoTurn) {
        if(canPlay(0)) {
            statusOne.innerHTML = 'Status: Playing';
            statusTwo.innerHTML = 'Status: Waiting';

            for(let i = 0; i < n; i++) {
                let hole = $('lower-hole-'+i);
                hole.classList.add('hole-current');
            }
        }
    } else {
        if(canPlay(1)) {
            statusOne.innerHTML = 'Status: Waiting';
            statusTwo.innerHTML = 'Status: Playing';
            for(let i = 0; i < n; i++) {
                $('upper-hole-'+i).classList.add('hole-current');
            }
        }
    }

}

function updateClassifications(points) {
    classifications.push(points);
    classifications.sort();
    classifications.reverse();
    classifications = classifications.slice(0,10);
    console.log(classifications);
}

function canPlay(player) {
    let sum = 0;
    if(player===0) {
        for(let i = 0; i < n; i++) {
            sum += seedArray[i];
        }
    }else {
        for(let i = n+1; i < 2*n+1; i++) {
            sum += seedArray[i];
        }
    }
    // console.log("n is " + n);
    // console.log("player "+ player + " has " + sum + " seeds");
    if(sum!==0) {
        return true;
    }
    endGame();
    return false;
}

function endGame() {
    gameOver = true;
    let statusOne = $("player-one-status");
    let statusTwo = $("player-two-status");
    countSeeds();
    let scoreOne = seedArray[n];
    let scoreTwo = seedArray[2*n+1];

    if(scoreOne > scoreTwo) {
        updateClassifications(scoreOne);
        statusOne.innerHTML = $('p1-name').innerHTML + ' won!';
        statusTwo.innerHTML = $('p2-name').innerHTML + ' lost!';
    } else if(scoreTwo > scoreOne) {
        statusOne.innerHTML = $('p1-name').innerHTML + ' lost!';
        statusTwo.innerHTML = $('p2-name').innerHTML + ' won!';
    } else {
        statusOne.innerHTML = 'TIE!';
        statusTwo.innerHTML = 'TIE!';
    }
    $('quit').value = 'Return to Main Screen';


}

function countSeeds() {
    for(let i = 0; i < n; i++) {
        seedArray[n] += seedArray[i];
        seedArray[i] = 0;
    }
    for(let i = n+1; i < 2*n+1; i++) {
        seedArray[2*n+1] += seedArray[i];
        seedArray[i] = 0;
    }
    updateBoard();
}


function generateSeeds(id, seedNum) {
    for (let i = 0; i < seedNum; i++) {
        let leftm = (Math.floor(Math.random() * 70) + 5) + '%';
        let topm = (Math.floor(Math.random() * 30) + 5) + '%';
        let rotation = (Math.floor(Math.random() * 90));
        let seed = document.createElement('div');
        seed.classList.add('seed');
        seed.style.width = 5 + '%';
        seed.style.left = leftm;
        seed.style.top = topm;
        seed.style.transform = "rotate(" + rotation + "deg)";
        id.appendChild(seed);
    }
}

function makeMove(player, id) {
    updateGame();
    if (playerTwoTurn != player || gameOver) {
        // console.log("game over is " + gameOver);
        // console.log("ptt is " + playerTwoTurn + " and player is " + player);
        return;
    }
    let pos = player * (n + 1) + id;
    let seeds = seedArray[pos];
    console.log("position " + pos + " of array = " + seeds);
    seedArray[pos] = 0;
    while (seeds--) {
        pos++;
        if (pos > 2 * n + 1) {
            pos = 0;
        }
        if ((pos === n && player === 1) || (pos === (2 * n + 1) && player === 0)) { // skip adversary's container
            seeds++;
            continue;
        }
        seedArray[pos]++;
        console.log("inserting seed in position " + pos);
    }
    let inversePos = -(pos-2*n);
    // console.log("pos: " + pos +", inverse pos: " + inversePos);
    if ((player === 0 && pos != n) || (player === 1 && pos != 2*n+1)) { // Change current player if last pos is not their container
        playerTwoTurn = !playerTwoTurn;
    }
    if(pos != n && pos != 2*n+1 && seedArray[pos]===1 && ((player === 0 && pos < n) || (player === 1 && pos > n))) {
        let transferingSeeds = seedArray[pos] + seedArray[inversePos];
        seedArray[pos] = 0;
        seedArray[inversePos] = 0;
        if(player) {
            seedArray[2*n+1] += transferingSeeds;
        } else {
            seedArray[n] += transferingSeeds;
        }
    }
    updateGame();
}

// *****************************

function display() {
    let checkbox = $("pc-checkbox");
    let options = document.getElementsByClassName("pc-options");

    if (checkbox.checked == true) {
        for (i = 0; i < options.length; i++) {
            options[i].classList.remove("hidden");
        }
        $("p2-input").value = "AI Player";
        $("p2-input").readOnly = true;
        $("p2-input-pass").setAttribute("disabled", true);
    } else {
        for (i = 0; i < options.length; i++) {
            options[i].classList.add("hidden");
        }
        $("p2-input").value = "";
        $("p2-input").readOnly = false;
        $("p2-name").innerHTML = "Player 2";
        $("p2-input-pass").removeAttribute("disabled");
    }

}

async function toggleBoard(toggleMode) {
    let homescreen = $("div-homescreen");
    let gameboard = $("div-gameboard");


    if (toggleMode) {
        fade(homescreen);
        await sleep(300);
        homescreen.classList.toggle("hidden");
        gameboard.classList.toggle("hidden");
        unfade(gameboard);

    } else {
        fade(gameboard);
        await sleep(300);
        gameboard.classList.toggle("hidden");
        $("p1-name").innerHTML = "Player 1";
        homescreen.classList.toggle("hidden");
        unfade(homescreen);
    }

}


function startGame(playerStart) {
    gameOver = false;
    var toggleMode = true;
    toggleBoard(toggleMode);

    playerTwoTurn = playerStart;

    let cavityNumber = parseInt(document.querySelector('input[name="cavity-number"]:checked').value);
    n = cavityNumber;
    let seedNumber = parseInt($("seednum").value);
    $('quit').value = 'Quit';
    let player1 = $("p1-input").value;
    let player2 = $("p2-input").value;

    let upperRow = $("upper-row");
    let lowerRow = $("lower-row");

    for (let i = cavityNumber - 1; i >= 0; i--) {
        let newHole = document.createElement('div');
        newHole.id = 'upper-hole-' + i;
        newHole.classList.add('hole');
        upperRow.appendChild(newHole);
        newHole.addEventListener('click', () => {
            makeMove(1, i)
        })
    }
    for (let i = 0; i < cavityNumber; i++) {
        let newHole = document.createElement('div');
        newHole.id = 'lower-hole-' + i;
        newHole.classList.add('hole');
        lowerRow.appendChild(newHole);
        newHole.addEventListener('click', () => {
            makeMove(0, i)
        })
    }

    if (player1 != "") {
        $("p1-name").innerHTML = player1;
    }
    if (player2 != "") {
        $("p2-name").innerHTML = player2;
    }

    seedArray = new Array(2 * cavityNumber + 2);
    for (let i = 0; i < 2 * cavityNumber + 2; i++) {
        if (i === cavityNumber || i === (2 * cavityNumber + 1)) {
            seedArray[i] = 0;
        } else {
            seedArray[i] = seedNumber;
        }
    }
    updateGame();
}


function quitGame() {
    var toggleMode = false;
    toggleBoard(toggleMode);

    let upperRow = $("upper-row");
    let child = upperRow.lastElementChild;
    while (child) {
        upperRow.removeChild(child);
        child = upperRow.lastElementChild;
    }

    let lowerRow = $("lower-row");
    child = lowerRow.lastElementChild;
    while (child) {
        lowerRow.removeChild(child);
        child = lowerRow.lastElementChild;
    }
}

async function showTutorial() {
    let tutorial = $("tutorial-window");

    if (tutorial.style.opacity == 0) {
        unfade(tutorial);
        await sleep(300);
        tutorial.classList.toggle("hidden");
        tutorial.style.opacity = 1;
    } else {
        fade(tutorial);
        await sleep(300);
        tutorial.classList.toggle("hidden");
        tutorial.style.opacity = 0;
    }
}

async function displayClassification() {
    console.log(classifications);
    let topBoard = $("classification-board");
    let list = $("classification-list");

    for (i = 0; i < 10; i++) {
        let item = document.createElement('li');
        if (classifications[i] !== undefined) {
            item.appendChild(document.createTextNode(classifications[i] + ' points'));
        } else {
            item.appendChild(document.createTextNode('--------'));
        }
        list.appendChild(item);
    }

    unfade(topBoard);
    await sleep(300);
    topBoard.classList.toggle("hidden");
    topBoard.style.opacity = 1;

}

async function closeClassification() {
    let topBoard = $("classification-board");
    let list = $("classification-list");

    fade(topBoard);
    await sleep(300);
    topBoard.classList.toggle("hidden");
    topBoard.style.opacity = 0;
    topBoard.classList.add("hidden");


    list.innerHTML = '';
}
