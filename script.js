function display() {
    let checkbox = document.getElementById("pc-checkbox");
    let options = document.getElementById("pc-options");

    if(checkbox.checked == true) {
        options.classList.remove("hidden");
    } else {
        options.classList.add("hidden");
    }

}