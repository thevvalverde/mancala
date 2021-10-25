function display() {
    let checkbox = document.getElementById("pc-checkbox");
    let options = document.getElementById("pc-options");

    if(checkbox.checked == true) {
        options.style.display = "block";
    } else {
        options.style.display = "none";
    }

}