let addButton = document.getElementById('addButton');

addButton.onclick = uploadText;
const formData = new FormData();

function uploadText(){

    let id = document.querySelector('input[name="id"]').value;
    let title = document.querySelector('input[name="title"]').value;
    let author = document.querySelector('input[name="author"]').value;
    let text = document.querySelector('input[name="text"]').value;

    if( !id || !title || !author || !text) {
        alert("заполните все поля!")
        return;
    } 

    formData.delete('id')
    formData.delete('title')
    formData.delete('author')
    formData.delete('text')
    
    formData.append("id", id);
    formData.append("title", title);
    formData.append("author", author);
    formData.append("text", text);

    let tkn = getCookie("token")
    alert("keks")

    fetch('http://localhost:3000/auth/edit-post', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${tkn}`
        },
        body: JSON.stringify(Object.fromEntries(formData))
    })
    .then(data => console.log(data))
    .catch(error => console.log(error))
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}