console.log("script loaded");
var code = null;

const params = new URLSearchParams(window.location.search);
const client_id = params.get('client_id');
const redirect_uri = params.get('redirect_uri');
const scope = params.get("scope");
const state = params.get("state");

const emailBox = document.getElementById("email");
const passwordBox = document.getElementById("password");

const loginBox = document.getElementById('login-box');
const approveBox = document.getElementById('approve-box');
const scopeList = document.getElementById("scope-list");

const login = async()=>{
    try {
        const email = emailBox.value;
        const password = passwordBox.value;
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
        if(data.error) return alert(data.error);

        console.log(data);
        code = data.code;
        const privileges = data.privileges;
        privileges.map(privilege=>{
            const item = document.createElement('li');
            item.innerHTML = `
                    <img src="./check.png" alt="checkbox" class="checkbox" />
                    <span>${privilege.description}</span>
            `;
            scopeList.append(item);
        });
        loginBox.classList.toggle('hide');
        approveBox.classList.toggle('hide');
    } catch (error) {
        alert(error.message);
        console.log(error);
    }
    
}

const approve = ()=>{
    window.location.replace(`${redirect_uri}?code=${code}&state=${state}&redirect_uri=${redirect_uri}`);
}
const cancel = ()=>{
    const params = new URLSearchParams({
        error: "access_denied"
    });
    window.location.replace(`${redirect_uri}?${params.toString()}`);
}