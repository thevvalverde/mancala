$("register-button").addEventListener('click', getData);
$("login-button").addEventListener('click', getData);

var base = "http://twserver.alunos.dcc.fc.up.pt:8008/"

function getData() {
    let nick, pass, confirmpass;
    if(this.value==="register") {
        nick = $("register-nick").value;
        pass = $("register-pass").value;
        confirmpass = $("register-confpass").value;
        if(nick===""){
            alert("Nickname cannot be empty!");
            return;
        }
        if(pass === "") {
            alert("Type in a password!");
            return;
        }
        if(pass !== confirmpass) {
            alert("Passwords do not match!");
            return;
        }
    } else {
        nick = $("p1-input").value;
        pass = $("p1-input-pass").value;
    }
    register(nick, pass);
}

function register(nick, pass) {
    let url = base + "register";
    let xhr = new XMLHttpRequest();

    let data = new Object();
    data.nick = nick;
    data.password = pass;

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/json');

    xhr.send(JSON.stringify(data));

}