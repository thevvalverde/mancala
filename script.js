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

function startGame() {
    let homescreen = document.getElementById("div-homescreen");
    let gameboard  = document.getElementById("div-gameboard");

    homescreen.classList.toggle("hidden");
    gameboard.classList.toggle("hidden");

    let cavityNumber = parseInt(document.querySelector('input[name="cavity-number"]:checked').value);
    let seedNumber   = parseInt(document.getElementById("seednum").value);


}