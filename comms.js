$("login-button").addEventListener('click', getRegisterData);
$("start").addEventListener('click', getJoinData);

var group = 12915;

var userpass = "";
var usernick = "";
var gamehash = "";

var base = "http://twserver.alunos.dcc.fc.up.pt:8008"
var eventSource;
var first = true;

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
                nickOne = nick;
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
            console.log(request.status);
            if(request.status===200) {
                let response = JSON.parse(request.response);
                gamehash = response.game;
                update();
            } else if (request.status===400) {
                alert("Unexpected error!")
            }
        }
    };

    request.withCredentials = false;
    request.open('POST', url);
    request.send(JSON.stringify(data));
}

function update() {
    let url = base + "/update?";
    url += "nick=" + usernick;
    url += "&game=" + gamehash;
    url = encodeURI(url)
    console.log(url);
    eventSource = new EventSource(url)
    eventSource.onerror = (e) => {
        console.log(e);
    }
    eventSource.onopen = (e) => {
        console.log("Connected");
    }
    eventSource.onmessage = (e) => {
        let data = JSON.parse(e.data);
        getBoardData(data);
    }

}

function getBoardData(data) {
    let names = Object.getOwnPropertyNames(data.stores);
    let playerStart = data.board.turn;
    let p1name = usernick;
    let p2name = (names[0] == usernick) ? names[1] : names[0];
    let newsize = data["board"]["sides"][usernick]["pits"].length
    let newinitial = data["board"]["sides"][usernick]["pits"][0];
    if(first) {
        let lowerRow = $("lower-row");
        for (let i = 0; i < size; i++) {
            let newHole = document.createElement('div');
            newHole.id = 'lower-hole-' + i;
            newHole.classList.add('hole');
            lowerRow.appendChild(newHole);
            newHole.addEventListener('click', () => {
                notify(usernick, userpass, gamehash, i);
            })
        }
        first = false;
    }
    let p1pits = data["board"]["sides"][p1name]["pits"];
    let p1store = data["board"]["sides"][p1name]["store"];
    let p2pits = data["board"]["sides"][p2name]["pits"];
    let p2store = data["board"]["sides"][p2name]["store"];
    let seedDisp = p1pits.concat(p1store, p2pits, p2store);
    setBoard(playerStart, p1name, p2name, seedDisp);
}

function notify(nick, password, game, move) {

    let url = base + "/notify";

    const data = {
        nick,
        password,
        game,
        move
    };
    console.log(data);

    var request = new XMLHttpRequest();

    request.onreadystatechange = () => {
        // print JSON response
        if (request.readyState === 4) {
            // parse JSON
            if(request.status===200) {
                console.log(request.response);
            } else if (request.status===400) {
                console.log("oopsie!");
            }
        }
    };

    request.withCredentials = false;
    request.open('POST', url);
    request.send(JSON.stringify(data));
}