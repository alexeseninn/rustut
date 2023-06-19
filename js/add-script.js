let addButton = document.getElementById('addButton');

addButton.onclick = uploadText;
const formData = new FormData();
const formDataText = new FormData();

function upload(){

    fetch('/upload-photo', {
        method: 'POST',
        body: formData
    })
    .then(response => {
    // handle response
    })
    .catch(error => {
        console.error(error);
    });

}

function uploadText(){

    let filename = document.querySelector('input[id="filename"]').value;
    let author = document.querySelector('input[id="author"]').value;
    let text = document.querySelector('input[id="text"]').value;
    let s = document.querySelector('input[type="file"]');

    if(!filename || !author || !text || !s.files[0]) {
        alert("заполните все поля!")
        return;
    } 

    formDataText.delete('title')
    formDataText.delete('author')
    formDataText.delete('text')
    
    formDataText.append("title", filename);
    formDataText.append("author", author);
    formDataText.append("text", text);

    let tkn = getCookie("token")

    fetch('http://localhost:3000/auth/add-post', {
        method: 'POST',
        headers: {
    'Content-Type': 'application/json',
    "Authorization": `Bearer ${tkn}`
        },
        body: JSON.stringify(Object.fromEntries(formDataText))
    })
    .then(response => response.json(), upload())
    .then(data => console.log(data))
    .catch(error => console.log(error))
}

window.addEventListener('load', function() {
    document.querySelector('input[type="file"]').addEventListener('change', function() {
    if (this.files && this.files[0]) {
        let img = document.querySelector('img');
        img.onload = () => {
            URL.revokeObjectURL(img.src);
        }
        let fullPath = document.getElementById('upload').value;
        if (fullPath) {
            let startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
            var filename = fullPath.substring(startIndex);
            if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
                filename = filename.substring(1);
            }
        }
        img.src = URL.createObjectURL(this.files[0]); // set src to blob url
        let file = this.files[0];
        
        let now = new Date();
        filename = String(now.getFullYear()) + String(now.getMonth()) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getMilliseconds()) + '.jpg';

        let newFile = new File([file], filename, { type: file.type });

        document.getElementById('filename').value = filename;
        formData.delete('photo')
        formData.delete('name')
        
        formData.append('photo', newFile);
        formData.append('name', filename);
    }
    });
});

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}