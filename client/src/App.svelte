<script>
  import router from 'page';
  import {currentRoute} from "./stores.js";
  import Home from "./pages/Home.svelte";
  import About from "./pages/About.svelte";
  import Login from "./pages/Login.svelte"
  import Register from "./pages/Register.svelte"
  import Chairs from "./pages/Chairs.svelte"
  import Header from "./components/NavBar.svelte";
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
  <Header active={$currentRoute} />
  <svelte:component this={page} {params} />
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
</style>
