function display() {
    let checkbox = document.getElementById("pc-checkbox");
    let options = document.getElementsByClassName("pc-options");

    if(checkbox.checked == true)
    {
        for(i = 0; i < options.length; i++){
            options[i].classList.remove("hidden");
        }
        document.getElementById("Jogador2").value = "AI Player";
        document.getElementById("Jogador2").readOnly = true;
    }
    else
    {
        for(i = 0; i < options.length; i++){
            options[i].classList.add("hidden");
        }
        document.getElementById("Jogador2").value = "";
        document.getElementById("Jogador2").readOnly = false;
    }

}
