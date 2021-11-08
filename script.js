function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function display() {
    let checkbox = document.getElementById("pc-checkbox");
    let options = document.getElementsByClassName("pc-options");

    if(checkbox.checked == true)
    {
        for(i = 0; i < options.length; i++){
            options[i].classList.remove("hidden");
        }
        document.getElementById("player2Input").value = "AI Player";
        document.getElementById("player2Input").readOnly = true;
        document.getElementById("player2InputPass").setAttribute("disabled", true);
    }
    else
    {
        for(i = 0; i < options.length; i++){
            options[i].classList.add("hidden");
        }
        document.getElementById("player2Input").value = "";
        document.getElementById("player2Input").readOnly = false;
        document.getElementById("player2Name").innerHTML = "Player 2";
        document.getElementById("player2InputPass").removeAttribute("disabled");
    }

}

async function toggleBoard(toggleMode) {
    let homescreen = document.getElementById("div-homescreen");
    let gameboard  = document.getElementById("div-gameboard");


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
      document.getElementById("player1Name").innerHTML = "Player 1";
      homescreen.classList.toggle("hidden");
      unfade(homescreen);
    }

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

function startGame() {
    var toggleMode = true;
    toggleBoard(toggleMode);

    let cavityNumber = parseInt(document.querySelector('input[name="cavity-number"]:checked').value);
    let seedNumber   = parseInt(document.getElementById("seednum").value);
    let player1 = document.getElementById("player1Input").value;
    let player2 = document.getElementById("player2Input").value;

    let upperRow = document.getElementById("upper-row");
    let lowerRow = document.getElementById("lower-row");

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
      document.getElementById("player1Name").innerHTML = player1;
    }
    if(player2 != "")
    {
      document.getElementById("player2Name").innerHTML = player2;
    }
}


function quitGame() {
    var toggleMode = false;
    toggleBoard(toggleMode);

    let upperRow = document.getElementById("upper-row");
    let child = upperRow.lastElementChild;
    while(child) {
        upperRow.removeChild(child);
        child = upperRow.lastElementChild;
    }

    let lowerRow = document.getElementById("lower-row");
    child = lowerRow.lastElementChild;
    while(child) {
        lowerRow.removeChild(child);
        child = lowerRow.lastElementChild;
    }
}

async function showTutorial()
{
  let tutorial = document.getElementById("tutorialWindow");

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
    let topBoard = document.getElementById("classification-board");
    let list = document.getElementById("classification-list");

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
    let topBoard = document.getElementById("classification-board");
    let list = document.getElementById("classification-list");
    list.innerHTML = '';

    fade(topBoard);
    await sleep(300);
    topBoard.classList.toggle("hidden");
    topBoard.style.opacity = 0;
    topBoard.classList.add("hidden");

}
