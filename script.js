function display() {
    let checkbox = document.getElementById("pc-checkbox");
    let options = document.getElementsByClassName("pc-options");

    if(checkbox.checked == true)
    {
        for(i = 0; i < options.length; i++){
            options[i].classList.remove("hidden");
        }
        document.getElementById("player2").value = "AI Player";
        document.getElementById("player2").readOnly = true;
    }
    else
    {
        for(i = 0; i < options.length; i++){
            options[i].classList.add("hidden");
        }
        document.getElementById("player2").value = "";
        document.getElementById("player2").readOnly = false;
    }

}

function toggleBoard() {
    let homescreen = document.getElementById("div-homescreen");
    let gameboard  = document.getElementById("div-gameboard");

    homescreen.classList.toggle("hidden");
    gameboard.classList.toggle("hidden");

}

function startGame() {
    toggleBoard();
 
    let cavityNumber = parseInt(document.querySelector('input[name="cavity-number"]:checked').value);
    let seedNumber   = parseInt(document.getElementById("seednum").value);

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

}


function quitGame() {
    toggleBoard();

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