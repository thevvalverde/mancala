
const $ = (selector) => document.getElementById(selector);

//        Click listeners

$("button-tutorial").addEventListener('click', showTutorial);
$("close-tutorial").addEventListener('click', showTutorial);
$("button-classification").addEventListener('click', displayClassification);
$("close-classification").addEventListener('click', closeClassification);
$("start").addEventListener('click', ()=>{startGame(true)});
$("pc-start").addEventListener('click', ()=>{startGame(false)});
$("pc-checkbox").addEventListener('change', display);
$("quit").addEventListener('click', quitGame);


//      General Animations

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function fade(element) {
    var op = 1;
    var timer = setInterval(function () {
        if (op <= 0.1){
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
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 10);
}

let playerOneTurn = true;

function updateStatus() {
    let statusOne = $("player-one-status");
    let statusTwo = $("player-two-status");

    if(playerOneTurn) {
        statusOne.innerHTML = 'Status: Playing';
        statusTwo.innerHTML = 'Status: Waiting';
    } else {
        statusTwo.innerHTML = 'Status: Playing';
        statusOne.innerHTML = 'Status: Waiting';
    }
}

function display() {
    let checkbox = $("pc-checkbox");
    let options = document.getElementsByClassName("pc-options");


    updateStatus();

    if(checkbox.checked == true)
    {
        for(i = 0; i < options.length; i++){
            options[i].classList.remove("hidden");
        }
        $("p2-input").value = "AI Player";
        $("p2-input").readOnly = true;
        $("p2-input-pass").setAttribute("disabled", true);
    }
    else
    {
        for(i = 0; i < options.length; i++){
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
    let gameboard  = $("div-gameboard");


    if(toggleMode)
    {
      fade(homescreen);
      await sleep(300);
      homescreen.classList.toggle("hidden");
      gameboard.classList.toggle("hidden");
      unfade(gameboard);

    }
    else
    {
      fade(gameboard);
      await sleep(300);
      gameboard.classList.toggle("hidden");
      $("p1-name").innerHTML = "Player 1";
      homescreen.classList.toggle("hidden");
      unfade(homescreen);
    }

}

function startGame(playerStart) {
    var toggleMode = true;
    toggleBoard(toggleMode);

    playerOneTurn = playerStart;
    updateStatus();

    let cavityNumber = parseInt(document.querySelector('input[name="cavity-number"]:checked').value);
    let seedNumber   = parseInt($("seednum").value);
    let player1 = $("p1-input").value;
    let player2 = $("p2-input").value;

    let upperRow = $("upper-row");
    let lowerRow = $("lower-row");

    for(let i = 0; i < cavityNumber; i++) {
        let newHole = document.createElement('div');
        newHole.className = 'hole';
        upperRow.appendChild(newHole);
    }
    for(let i = 0; i < cavityNumber; i++) {
        let newHole = document.createElement('div');
        newHole.className = 'hole';
        lowerRow.appendChild(newHole);
    }

    if(player1 != "")
    {
      $("p1-name").innerHTML = player1;
    }
    if(player2 != "")
    {
      $("p2-name").innerHTML = player2;
    }
}


function quitGame() {
    var toggleMode = false;
    toggleBoard(toggleMode);

    let upperRow = $("upper-row");
    let child = upperRow.lastElementChild;
    while(child) {
        upperRow.removeChild(child);
        child = upperRow.lastElementChild;
    }

    let lowerRow = $("lower-row");
    child = lowerRow.lastElementChild;
    while(child) {
        lowerRow.removeChild(child);
        child = lowerRow.lastElementChild;
    }
}

async function showTutorial()
{
  let tutorial = $("tutorial-window");

  if(tutorial.style.opacity == 0)
  {
    unfade(tutorial);
    await sleep(300);
    tutorial.classList.toggle("hidden");
    tutorial.style.opacity = 1;
  }
  else
  {
    fade(tutorial);
    await sleep(300);
    tutorial.classList.toggle("hidden");
    tutorial.style.opacity = 0;
  }
}
var classification = [10, 12];

async function displayClassification() {
    let topBoard = $("classification-board");
    let list     = $("classification-list");

    for(i = 0; i < 10; i++) {
        let item = document.createElement('li');
        if(classification[i]!==undefined) {
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
    let list     = $("classification-list");

    fade(topBoard);
    await sleep(300);
    topBoard.classList.toggle("hidden");
    topBoard.style.opacity = 0;
    topBoard.classList.add("hidden");


    list.innerHTML = '';
}
