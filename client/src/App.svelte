<script>
  import router from 'page';
  import {currentChairId} from "./stores.js";
  import {currentRoute} from "./stores.js";
  import Home from "./pages/Home.svelte";
  import About from "./pages/About.svelte";
  import Login from "./pages/Login.svelte"
  import Register from "./pages/Register.svelte"
  import Chairs from "./pages/Chairs.svelte"
  import Header from "./components/Header.svelte";
  import ChairInfo from "./pages/ChairInfo.svelte";



  let page;
  let params;


  router('/', (ctx) => {
    page = Home;
    currentRoute.set(ctx.pathname);
  });
  router('/about', (ctx) => {
    page = About;
    currentRoute.set(ctx.pathname);
  });
  router('/login', (ctx) => {
    page = Login;
    currentRoute.set(ctx.pathname);
  });
  router('/register', (ctx) => {
    page = Register;
    currentRoute.set(ctx.pathname);
  });
  router('/chairs', (ctx) => {
    page = Chairs;
    currentRoute.set(ctx.pathname);
  });
  router('/chairinfo', (ctx) => {
    page = ChairInfo;
    currentRoute.set(ctx.pathname);
  });

  router.start();
</script>

<main>
<!--  <img src={logo} alt="Svelte Logo" />-->
  <Header active={$currentRoute} />
  <svelte:component this={page} {params} />
  <a>{$currentChairId}</a>
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  main {
    text-align: center;
    margin: 0;
    padding: 0;
    height: 100vw;
    overflow-x: hidden;
  }



</style>
