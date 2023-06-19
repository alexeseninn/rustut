const TOKEN = '5961153363:AAEHsfVlAxzE8MwONrbUFiFaw5XVZurtbsg';
const CHAT_ID = '-859608299';
const formData = new FormData();

let sendMessage = document.getElementById('sendMessage');
let enterButton = document.getElementById('enterButton');
let loginButton = document.getElementById('loginButton');
let cloawAuthButton = document.getElementById('closeAuthButton');

sendMessage.onclick = sendMsg;
enterButton.onclick = openLogin;
loginButton.onclick = upload;
cloawAuthButton.onclick = closeLogin;

function upload(){

    let login = document.querySelector('input[id="login"]').value;
    let password = document.querySelector('input[id="password"]').value;

    formData.delete('username')
    formData.delete('password')
    
    formData.append("username", login);
    formData.append("password", password);

    fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
    'Content-Type': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(formData))
    })
    .then(response => response.json(),
        closeLogin())
    .then(data => console.log(data))
    .catch(error => console.log(error))
}

function openLogin() {
    const name = document.querySelector('.auth');
    name.style.display = "flex";
}
function closeLogin() {
    document.getElementById('login').value = null;
    document.getElementById('password').value = null;
    const name = document.querySelector('.auth');
    name.style.display = "none";
}

function sendMsg() {
    const name = document.querySelector('.form-control1').value;
    const phone = document.querySelector('.form-control2').value;
    const mess = document.querySelector('.form-control3').value;

    if (name =='' || phone == '' || mess == ''){
        alert("Пожалуйста, заполните все три поля")
        return
    }

    text = "Имя: " + name + ".     Телефон: " + phone + ".     Сообщение: " + mess;

    const url = `https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${text}`;
    const xht = new XMLHttpRequest();
    xht.open("GET", url);
    xht.send();

    alert("Сообщение отправлено!")

    document.querySelector('.form-control1').value = null;
    document.querySelector('.form-control2').value = null;
    document.querySelector('.form-control3').value = null;
    sendMessage.disabled = true;

    setTimeout(enab, 10000);
    function enab() {
        sendMessage.disabled = false;
    }
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}