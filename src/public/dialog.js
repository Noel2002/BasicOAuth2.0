console.log("script loaded");
var code = null;

const params = new URLSearchParams(window.location.search);
const client_id = params.get('client_id');
const redirect_uri = params.get('redirect_uri');
const scope = params.get("scope");
const state = params.get("state");

const emailBox = document.getElementById("email");
const passwordBox = document.getElementById("password");

const login = async()=>{
    try {
        // const email = emailBox.value;
        // const password = passwordBox.value;
        const email = "john@doe.com";
        const password = "password123";
        const body = {
            client_id,
            redirect_uri,
            scope,
            state,
            email,
            password
        };
    
        const res = await fetch('/auth/authenticate', {
            method: 'POST',
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        });
    
        const data = await res.json();
        console.log(data);
        code = data.code
    } catch (error) {
        console.log(error);
    }
    
}

const approve = ()=>{
    window.location.replace(`${redirect_uri}?code=${code}`);
}