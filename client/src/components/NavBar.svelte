<script>
    export let active;
</script>


<div class="nav">
    <a class="nav-item" class:active={active === "/"} href="/">Home</a>
    <a class="nav-item" class:active={active === "/about"} href="/about">About</a>
    <a class="nav-item" class:active={active === "/chairs"} href="/chairs">Chairs</a>
    <a class="nav-item" class:active={active === "/login"} href="/login">Login</a>
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