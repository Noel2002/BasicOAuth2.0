const emailInput = document.getElementById("email");
const firnameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const ageInput = document.getElementById("age");
const passwordInput = document.getElementById("password");

const responseBox = document.getElementById("response-box");
const createBox = document.getElementById("create-box");


const createUser = async()=>{
    try {
        const email = emailInput.value;
        const firstName = firnameInput.value;
        const lastName = lastNameInput.value;
        const password = passwordInput.value;
        const age = parseInt(ageInput.value);

        const body = {
            email,
            firstName,
            lastName,
            password,
            age
        };
        
        const res = await fetch('/users', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            }
        });
        const data = await res.json();

        if(data.error) return alert(data.error);

        responseBox.classList.toggle("hide");
        createBox.classList.toggle("hide");
    } catch (error) {
        alert(error.message);
        console.log(error);
    }
}
