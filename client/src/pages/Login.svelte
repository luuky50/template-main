
<script>
    import router from "page";
    import {isAdmin, token, userId, userName} from "../stores.js";

    let userEmail = "";
    let userPassword = "";
    const login = async () => {
        const response = await fetch("http://localhost:5555/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: userEmail,
                password: userPassword
            })
        }).catch((error) =>{
            return alert("There was a unexpected error while logging in: " + error);
        })
        if(!response.ok){
            return alert(await response.text());
        }
        const text = await response.text();
        await userId.set(JSON.parse(text).id)
        await userName.set(JSON.parse(text).username)
        await token.set(JSON.parse(text).token);
        await isAdmin.set(JSON.parse(text).isAdmin)
        router.redirect('/chairs')
    }

    function goToRegisterPage(){
        router.redirect('/register')
    }

</script>


<div class="login">
    <h1>Login</h1>
    <input class="login-input" type="text" placeholder="Email" bind:value={userEmail}>
    <input class="login-input" type="password" placeholder="Password" bind:value={userPassword}>
    <button class="login-button" on:click={login}>Login</button>
    <button class="login-button" on:click={goToRegisterPage}>Register</button>
</div>

<style>
    .login {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100vh;
    }

    .login-input {
        width: 300px;
        height: 40px;
        margin: 10px;
        border-radius: 5px;
        border: 1px solid #ccc;
        padding: 10px;
    }

    .login-button {
        cursor: pointer;
        width: 300px;
        height: 40px;
        margin: 10px;
        border-radius: 5px;
        border: 1px solid #ccc;
        padding: 10px;
        background-color: #ccc;
    }
</style>

