<script>
    import router from "page";
    import {token, userId, userName} from "../stores.js";
    let userEmail = "";
    let userPassword = "";
    let userPasswordRepeat = "";
    const register = async () => {
        if(userPassword !== userPasswordRepeat){
            return alert("Passwords aren't the same")
        }
        const response = await fetch("http://localhost:5555/user", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: userEmail,
                password: userPassword
            })
        })
        if(!response.ok){
            return alert(await response.text());
        }
        const text = await response.text();
        console.log(text);
        await userId.set(JSON.parse(text).id)
        await userName.set(JSON.parse(text).username)
        await token.set(JSON.parse(text).token);
        router.redirect('/chairs')
    }

    function goToLoginPage(){
        router.redirect('/login')
    }

</script>


<label class="register">
    <h1>Register</h1>
    Email<input class="register-input" bind:value={userEmail} type="text" name="userEmail">
    Password<input class="register-input" bind:value={userPassword} type="password" name="userPassword">
    Password repeat<input class="register-input" bind:value={userPasswordRepeat} type="password" name="userPassword">
    <button class="register-button" on:click={register}>Register</button>
    <button class="register-button" on:click={goToLoginPage}>Login</button>
</label>

<style>
    .register{
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100vh;
    }

    .register-input {
        width: 300px;
        height: 40px;
        margin: 10px;
        border-radius: 5px;
        border: 1px solid #ccc;
        padding: 10px;
    }

    .register-button {
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