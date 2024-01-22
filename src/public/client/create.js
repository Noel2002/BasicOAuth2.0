const nameInput = document.getElementById("name");
const urlInput = document.getElementById("redirectUrl");
const createBox = document.getElementById("create-box");
const responseBox = document.getElementById("response-box");
const clientIdElement = document.getElementById("client-id");
const clientSecretElement = document.getElementById("client-secret");

const createClient = async()=>{
    try {
        const name = nameInput.value;
        const redirect_uri = urlInput.value;
        const body = {
            name,
            redirectUrl: redirect_uri
        };
        
        const res = await fetch('/clients', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            }
        });
        const data = await res.json();
        const client = data.client;
        const clientId = client.id;
        const clientSecret = client.clientSecret;

        responseBox.classList.toggle("hide");
        createBox.classList.toggle("hide");
        clientIdElement.innerText = clientId;
        clientSecretElement.innerText = clientSecret;
        console.log(clientSecret);
    } catch (error) {
        alert(error.message);
        console.log(error);
    }
}

clientIdElement.onclick = ()=>{
    const content = clientIdElement.textContent;
    navigator.clipboard.writeText(content);
}

clientSecretElement.onclick = ()=>{
    const content = clientSecretElement.textContent;
    navigator.clipboard.writeText(content);
}