
<script>
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
        })
        if(!response.ok){
            console.log(response.status + " " + response.statusText);
        }
    }
</script>


<label id="loginMenu">
    Email<input bind:value={userEmail} type="text" name="userEmail">
    Password<input bind:value={userPassword} type="password" name="userPassword">
    <button on:click={login}>Login</button>
</label> <br>

<style>
    #loginMenu{
        display: flex;
        flex-flow: column;
        align-items: center;
    }
</style>

