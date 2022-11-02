<script>
    export let active;
</script>


<header id="main_header">
    <nav>
        <ul>
            <li><a class:active={active === "/"} href="/">Home</a></li>
            <li><a class:active={active === "/about"} href="/about">About</a></li>
            <li><a class:active={active === "/login"} href="/login">Login</a></li>
            <li><a class:active={active === "/chairs"} href="/chairs">Chairs</a></li>
        </ul>
    </nav>
</header>

<style>
    ul {
        display: flex;
        flex-flow: column;
        margin: 0;
        padding: 0;
        list-style-type: none;
        align-content: center;
    }

    a{
        color: #F2F2F2;
        background-color: transparent;
        text-decoration: none;
    }

    #main_header {
        width: 100%;
        background: #A6886D;
        top: 0;
        margin: 0;
        padding: 0;
        height: 100px;
    }

    a.active {
        font-weight: bold;
    }
</style>