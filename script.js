function display() {
    let checkbox = document.getElementById("pc-checkbox");
    let options = document.getElementById("pc-options");

    if(checkbox.checked == true)
    {
        options.classList.remove("hidden");
        document.getElementById("Jogador2").value = "AI Player";
    }
    else
    {
        options.classList.add("hidden");
        document.getElementById("Jogador2").value = "";
    }

}
