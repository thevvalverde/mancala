const $ = (selector) => document.getElementById(selector);

//        Click listeners

$("button-tutorial").addEventListener('click', showTutorial);
$("close-tutorial").addEventListener('click', showTutorial);
$("button-classification").addEventListener('click', displayClassification);
$("close-classification").addEventListener('click', closeClassification);
$("start").addEventListener('click', () => {
    startGame(true)
});
$("pc-start").addEventListener('click', () => {
    startGame(false)
});
$("pc-checkbox").addEventListener('change', display);
$("quit").addEventListener('click', quitGame);

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

let playerTwoTurn = false;

function updateStatus() {
    let statusOne = $("player-one-status");
    let statusTwo = $("player-two-status");

    if (!playerTwoTurn) {
        statusOne.innerHTML = 'Status: Playing';
        statusTwo.innerHTML = 'Status: Waiting';
    } else {
        statusTwo.innerHTML = 'Status: Playing';
        statusOne.innerHTML = 'Status: Waiting';
    }

}

function updateScore() {

    let scoreOne = $("p1-score");
    let scoreTwo = $("p2-score");
    let n = (seedArray.length - 2) / 2;
    console.log("N IS EQUAL TO " + n);

    scoreOne.innerHTML = 'Seeds: ' + seedArray[n];
    scoreTwo.innerHTML = 'Seeds: ' + seedArray[2 * n + 1];
}

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

let seedArray;

function startGame(playerStart) {
    var toggleMode = true;
    toggleBoard(toggleMode);

    playerTwoTurn = playerStart;

    let cavityNumber = parseInt(document.querySelector('input[name="cavity-number"]:checked').value);
    let seedNumber = parseInt($("seednum").value);
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
            makeMove(1, i, cavityNumber)
        })
    }
    for (let i = 0; i < cavityNumber; i++) {
        let newHole = document.createElement('div');
        newHole.id = 'lower-hole-' + i;
        newHole.classList.add('hole');
        lowerRow.appendChild(newHole);
        newHole.addEventListener('click', () => {
            makeMove(0, i, cavityNumber)
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
    updateStatus();
    updateBoard();
}

function updateBoard() {

    let n = (seedArray.length - 2) / 2;

    for (let i = 0; i < seedArray.length; i++) {
        let curr = seedArray[i];
        console.log('inserting ' + curr + ' seeds in ' + i);
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
            console.log("looking for " + p1Hole.id);
        } else {
            let p2Hole = $('upper-hole-' + (i - (n + 1)));
            if (p2Hole.childElementCount != curr) {
                p2Hole.textContent = '';
                generateSeeds(p2Hole, curr);
            }
            console.log("looking for " + p2Hole.id);
        }
    }

    updateScore();
}

function generateSeeds(id, seedNum) {
    for (let i = 0; i < seedNum; i++) {
        let leftm = (Math.floor(Math.random() * 50) + 20) + '%';
        let topm = (Math.floor(Math.random() * 60) + 10) + '%';
        let rotation = (Math.floor(Math.random() * 90));
        let seed = document.createElement('div');
        seed.classList.add('seed');
        seed.style.width = 10 + '%';
        seed.style.left = leftm;
        seed.style.top = topm;
        seed.style.transform = "rotate(" + rotation + "deg)";
        id.appendChild(seed);
    }
}

function makeMove(player, id, n) {
    if (playerTwoTurn == player) {
        return;
    }
    let pos = player * (n + 1) + id;
    let seeds = seedArray[pos];
    console.log("player " + player + " clicked hole " + id);
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
    }
    if ((player === 0 && pos > n) || (player === 1 && pos < n)) {
        playerTwoTurn = !playerTwoTurn;
        updateStatus();
    }
    updateBoard();
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
var classification = [10, 12];

async function displayClassification() {
    let topBoard = $("classification-board");
    let list = $("classification-list");

    for (i = 0; i < 10; i++) {
        let item = document.createElement('li');
        if (classification[i] !== undefined) {
            item.appendChild(document.createTextNode(classification[i] + ' points'));
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