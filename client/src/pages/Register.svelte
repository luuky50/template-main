<script>
    import router from "page";

    export let params;
    let userEmail = "";
    let userPassword = "";
    let userPasswordRepeat = "";
    const register = async () => {
        if(userPassword !== userPasswordRepeat){
            console.log("Passwords aren't the same")
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
            return console.log(response.status + " " + response.statusText);
        }
        router.redirect('/login')
        return response.json();
    }

    function goToLoginPage(){
        router.redirect('/login')
    }

</script>


<label id="registerMenu">
    Email<input bind:value={userEmail} type="text" name="userEmail">
    Password<input bind:value={userPassword} type="password" name="userPassword">
    Password repeat<input bind:value={userPasswordRepeat} type="password" name="userPassword">
    <button on:click={register}>Register</button>
    <button on:click={goToLoginPage}>Login</button>
</label>

<style>
    #registerMenu{
        display: flex;
        flex-flow: column;
        align-items: center;
    }
</style>