<script>
    import {isAdmin, token, userId, userName} from "../stores.js";
    export let active;

    const logout = async () =>{
        const response = await fetch("http://localhost:5555/auth/logout", {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + $token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).catch((error) =>{
            return alert("There was a unexpected error while logging out: " + error);
        })
        if(!response.ok){
            return alert(await response.text());
        }
        await userId.set(null)
        await userName.set("")
        await token.set(null);
        await isAdmin.set(false);
    }
</script>


<div class="nav">
    <a class="nav-item" class:active={active === "/"} href="/">Home</a>
    <a class="nav-item" class:active={active === "/about"} href="/about">About</a>
    <a class="nav-item" class:active={active === "/chairs"} href="/chairs">Chairs</a>
    {#if $userId === null}
    <a class="nav-item" class:active={active === "/login"} href="/login">Login</a>
    {:else}
    <a class="nav-item" on:click={logout} href="/">Logout</a>
    {/if}
</div>

<style>
    .nav {
        display: flex;
        flex-direction: row;
        justify-content: center;
        background: #eee;
        padding: 1rem;
        margin-bottom: 2rem;
    }

    .nav-item {
        display: inline-block;
        padding: 1rem;
        color: #111;
        background-color: #eee;
        text-decoration: none;
        border-radius: 1rem;
        margin: .5rem;
    }

    .nav-item:hover {
        background-color: #ddd;
        transition: background-color 0.3s ease;
    }

    .nav-item.active {
        color: #fff;
        background-color: #bbb;
    }
</style>