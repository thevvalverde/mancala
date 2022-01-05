$("login-button").addEventListener('click', getRegisterData);
$("start").addEventListener('click', getJoinData);

var group = 12915;

var userpass = "";
var usernick = "";

var base = "http://twserver.alunos.dcc.fc.up.pt:8008"

function updateUI(logged) {
    if(logged) {
        $("login-button").value = "Log Out"
        $("p1-title").innerHTML = "Logged in as:  " + usernick;
        $("p1-input").classList.add("hidden");
        $("p1-input-pass").classList.add("hidden");
    } else {
        $("login-button").value = "Login / Register"
        $("p1-title").innerHTML = "Jogador 1";
        $("p1-input").classList.remove("hidden");
        $("p1-input-pass").classList.remove("hidden");
    }
}

function getRegisterData() {
    if(logged) {
        logged = false;
        return updateUI();
    }
    let nick, pass, confirmpass;
    nick = $("p1-input").value;
    pass = $("p1-input-pass").value;
    if(nick===""){
        alert("Nickname cannot be empty!");
        return;
    }
    if(pass === "") {
        alert("Type in a password!");
        return;
    }
    register(nick, pass);
}

function register(nick, pass) {
    if(!XMLHttpRequest) { console.log("XHR não suportado"); return};

    let url = base + "/register";

    const data = {
        "nick": nick,
        "password": pass
    };

    var request = new XMLHttpRequest();

    request.onreadystatechange = () => {
        // print JSON response
        if (request.readyState === 4) {
            // parse JSON
            if(request.status===200) {
                usernick = nick
                userpass = pass
                logged = true;
                updateUI(true);
            } else if (request.status===400) {
                alert("Nickname already registered with different password!")
            }
        }
    };

    request.withCredentials = false;
    request.open('POST', url);
    request.send(JSON.stringify(data));
}

function getJoinData() {
    if(!logged) {
        alert("Please Log In!");
        return;
    }
    if(checkbox.checked) {
        return;
    }
    let size = parseInt(document.querySelector('input[name="cavity-number"]:checked').value);
    let initial = parseInt($("seednum").value);
    join(group, usernick, userpass, size, initial);
}

function join(group, usernick, userpass, size, initial) {

    let url = base + "/join";

    const data = {
        "group": group,
        "nick": usernick,
        "password": userpass,
        "size": size,
        "initial": initial
    };

    var request = new XMLHttpRequest();

    request.onreadystatechange = () => {
        // print JSON response
        if (request.readyState === 4) {
            console.log(request.response);
            if(request.status===200) {
                alert("joined! :)");
            } else if (request.status===400) {
                alert("Unexpected error!")
            }
        }
    };

    request.withCredentials = false;
    request.open('POST', url);
    request.send(JSON.stringify(data));
}