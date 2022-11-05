
<script>
    import router from "page";
    import {isAdmin, token, userId, userName} from "../stores.js";

    export let params;

    let userEmail = "";
    let userPassword = "";
    const login = async () => {
        const response = await fetch("http://localhost:5555/auth", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: userEmail,
                password: userPassword
            })
        }).catch((error) =>{
          console.log("There was a error while logging in: " + error);
        })
        if(!response.ok){
            console.log(response.status + " " + response.statusText);
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


<label id="loginMenu">
    Email<input bind:value={userEmail} type="text" name="userEmail">
    Password<input bind:value={userPassword} type="password" name="userPassword">
    <button on:click={login}>Login</button>
    <button on:click={goToRegisterPage}>Register</button>
</label>

<style>
    #loginMenu{
        display: flex;
        flex-flow: column;
        align-items: center;
    }
</style>

