const $ = (selector) => document.getElementById(selector);



// GLOBAL VARIABLES ***************

let scoreOneDisplay = $("p1-score");
let scoreTwoDisplay = $("p2-score");
let nickOneDisplay = $("p1-name");
let nickTwoDisplay = $("p2-name");
let statusOneDisplay = $("player-one-status");
let statusTwoDisplay = $("player-two-status");
let checkbox = $("pc-checkbox");

let seedArray = [];                         // Array of current board state
let size = 6;                               // Number of cavities
let initial = 4;                            // Initial number of seeds in each cavity
let pcGame = checkbox.checked;              // AI Game?

let classifications = [];                   // List of Top Scores

let nickOne = "Jogador 1";         
let nickTwo = "Jogador 2";
let computerName = "Computer";
let playerTwoTurn = false;

let logged = false;
let gameOver = false;

//        Click listeners
var radios = document.getElementsByClassName("size-radio");
for (var i = 0; i < radios.length; i++) {
    radios[i].addEventListener('change', function() {
            size = parseInt(this.value);
            console.log(size);
    });
}
$("seednum").addEventListener('change', ()=> {
    initial = parseInt($("seednum").value);
    console.log(initial);
})
$("button-tutorial").addEventListener('click', showTutorial);
$("close-tutorial").addEventListener('click', showTutorial);
$("button-classification").addEventListener('click', displayClassification);
$("close-classification").addEventListener('click', closeClassification);
$("start").addEventListener('click', () => {
    startGame(nickOne, size, initial);
    if(pcGame) {
        setBoard(nickOne, nickOne, nickTwo, seedArray);
    }
});
$("pc-start").addEventListener('click', () => {
    startGame(computerName, size, initial);
    setBoard(computerName, nickOne, computerName, seedArray);
});
$("pc-checkbox").addEventListener('change', ()=> {
    pcGame = checkbox.checked;
    display();
});
$("quit").addEventListener('click', quitGame);

// GENERAL ANIMATIONS ************ 

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

// GAME UPDATES *****************

function updateGame() {
    updateBoard();
    updateStatus();
    updateScore();
}

function updateScore() {
    scoreOneDisplay.innerHTML = 'Seeds: ' + seedArray[size];
    scoreTwoDisplay.innerHTML = 'Seeds: ' + seedArray[2 * size + 1];
}

function updateBoard() {
    for (let i = 0; i < (size+1)*2; i++) {
        let seeds = seedArray[i];
        if (i === size) {
            let p1Cav = $('right-container');
            if (p1Cav.childElementCount != seeds) {
                p1Cav.textContent = '';
                generateSeeds(p1Cav, seeds);
            }
        } else if (i === 2 * size + 1) {
            let p2Cav = $('left-container');
            if (p2Cav.childElementCount != seeds) {
                p2Cav.textContent = '';
                generateSeeds(p2Cav, seeds);
            }
        } else if (i < size) {
            let p1Hole = $('lower-hole-' + i);
            if (p1Hole.childElementCount != seeds) {
                p1Hole.textContent = '';
                generateSeeds(p1Hole, seeds);
            }
        } else {
            let p2Hole = $('upper-hole-' + (i - (size + 1)));
            if (p2Hole.childElementCount != seeds) {
                p2Hole.textContent = '';
                generateSeeds(p2Hole, seeds);
            }
        }
    }

}

async function updateStatus() {
    let upperRow = document.getElementById('upper-row');
    let lowerRow = document.getElementById('lower-row');

    for(let i = 0; i < size; i++) {
        $('upper-hole-'+i).classList.remove("hole-current");
        $('lower-hole-'+i).classList.remove("hole-current");
    }

    if (!playerTwoTurn) {
        if(canPlay(0)) {
            statusOneDisplay.innerHTML = 'Status: Playing';
            statusTwoDisplay.innerHTML = 'Status: Waiting';

            for(let i = 0; i < size; i++) {
                let hole = $('lower-hole-'+i);
                hole.classList.add('hole-current');
            }
        }
    } else {
        if(canPlay(1)) {
            statusOneDisplay.innerHTML = 'Status: Waiting';
            statusTwoDisplay.innerHTML = 'Status: Playing';
            for(let i = 0; i < size; i++) {
                $('upper-hole-'+i).classList.add('hole-current');
            }
            if(pcGame)
            {
              await sleep(1000);
              makeMovePC();
            }
        }
    }

}

function updateClassifications(points) {
    classifications.push(points);
    classifications.sort();
    classifications.reverse();
    classifications = classifications.slice(0,10);
}

// UI DISPLAY ******************

function display() {
    let options = document.getElementsByClassName("pc-options");

    if (pcGame) {
        for (i = 0; i < options.length; i++) {
            options[i].classList.remove("hidden");
        }
    } else {
        for (i = 0; i < options.length; i++) {
            options[i].classList.add("hidden");
        }
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
        nickOneDisplay.innerHTML = nickOne;
        homescreen.classList.toggle("hidden");
        unfade(homescreen);
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
    // console.log(classifications);
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

function canPlay(player) {
    let sum = 0;
    if(player===0) {
        for(let i = 0; i < size; i++) {
            sum += seedArray[i];
        }
    }else {
        for(let i = size+1; i < 2*size+1; i++) {
            sum += seedArray[i];
        }
    }
    if(sum!==0) {
        return true;
    }
    endGame();
    return false;
}

function endGame() {
    gameOver = true;
    countSeeds();
    let scoreOne = seedArray[size];
    let scoreTwo = seedArray[2*size+1];

    if(scoreOne > scoreTwo) {
        updateClassifications(scoreOne);
        statusOneDisplay.innerHTML = nickOne + ' won!';
        statusTwoDisplay.innerHTML = nickTwo + ' lost!';
    } else if(scoreTwo > scoreOne) {
        statusOneDisplay.innerHTML = nickOne + ' lost!';
        statusTwoDisplay.innerHTML = nickTwo + ' won!';
    } else {
        statusOneDisplay.innerHTML = 'TIE!';
        statusTwoDisplay.innerHTML = 'TIE!';
    }
    $('quit').value = 'Return to Main Screen';


}

function countSeeds() {
    for(let i = 0; i < size; i++) {
        seedArray[size] += seedArray[i];
        seedArray[i] = 0;
    }
    for(let i = size+1; i < 2*size+1; i++) {
        seedArray[2*size+1] += seedArray[i];
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

function makeMovePC()
{
  let choice = 0;
  let tmp = 0;

  while(tmp === 0) {
    choice = Math.floor(Math.random() * size);
    tmp = seedArray[(size+1)+choice];
    console.log("choice: " + choice + ", tmp = " + tmp);
  }

  makeMove(1, choice);
}

function makeMove(player, id) {
    if (playerTwoTurn != player || gameOver) {
        return;
    }
    let pos = player * (size + 1) + id;
    let seeds = seedArray[pos];
    seedArray[pos] = 0;
    while (seeds--) {
        pos++;
        if (pos > 2 * size + 1) {
            pos = 0;
        }
        if ((pos === size && player === 1) || (pos === (2 * size + 1) && player === 0)) { // skip adversary's container
            seeds++;
            continue;
        }
        seedArray[pos]++;
    }
    let inversePos = -(pos-2*size);
    if ((player === 0 && pos != size) || (player === 1 && pos != 2*size+1)) { // Change current player if last pos is not their container
        playerTwoTurn = !playerTwoTurn;
    }
    if(pos != size && pos != 2*size+1 && seedArray[pos]===1 && ((player === 0 && pos < size) || (player === 1 && pos > size))) {
        let transferingSeeds = seedArray[pos] + seedArray[inversePos];
        seedArray[pos] = 0;
        seedArray[inversePos] = 0;
        if(player) {
            seedArray[2*size+1] += transferingSeeds;
        } else {
            seedArray[size] += transferingSeeds;
        }
    }
    updateGame();
}

// *****************************
function startGame(playerOneName, newsize, newinitial) {
    if(!logged) {
        alert("Please Log In!");
        return;
    }
    gameOver = false;
    var toggleMode = true;
    toggleBoard(toggleMode);

    size = newsize;
    initial = newinitial;

    $('quit').value = 'Quit';
    nickOne = playerOneName;
    nickTwo = "Waiting for oponent...";

    let upperRow = $("upper-row");
    let lowerRow = $("lower-row");

    for (let i = size - 1; i >= 0; i--) {
        let newHole = document.createElement('div');
        newHole.id = 'upper-hole-' + i;
        newHole.classList.add('hole');
        upperRow.appendChild(newHole);
    }
    if(pcGame) {
        for (let i = 0; i < size; i++) {
            let newHole = document.createElement('div');
            newHole.id = 'lower-hole-' + i;
            newHole.classList.add('hole');
            lowerRow.appendChild(newHole);
            newHole.addEventListener('click', () => {
                makeMove(0, i)
            })
        }
    }

    if (nickOne != "") {
        nickOneDisplay.innerHTML = nickOne;
    }
    if (nickTwo != "") {
        nickTwoDisplay.innerHTML = nickTwo;
    }

    seedArray = new Array(2 * size + 2);
    for (let i = 0; i < 2 * size + 2; i++) {
        if (i === size || i === (2 * size + 1)) {
            seedArray[i] = 0;
        } else {
            seedArray[i] = initial;
        }
    }
}

function setBoard(playerTurn, playerOneName, playerTwoName, seedDisp) {
    nickTwo = playerTwoName;
    if (nickTwo != "") {
        nickTwoDisplay.innerHTML = nickTwo;
    }
    playerTwoTurn = (playerTurn == playerTwoName) ? true : false;
    seedArray = seedDisp;
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
