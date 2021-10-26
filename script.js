function display() {
    let checkbox = document.getElementById("pc-checkbox");
    let options = document.getElementById("pc-options");

    if(checkbox.checked == true)
    {
        options.classList.remove("hidden");
        document.getElementById("Jogador2").value = "AI Player";
        document.getElementById("Jogador2").readOnly = true;
    }
    else
    {
        options.classList.add("hidden");
        document.getElementById("Jogador2").value = "";
        document.getElementById("Jogador2").readOnly = false;
    }

}
