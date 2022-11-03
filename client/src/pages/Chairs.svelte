
<script>
    import router from "page";

    export let params;
    import {currentChairId} from "../stores.js";
    import {currentRoute} from "../stores.js";

    let chairs = [];

    const getChairs = async () => {
        const response = await fetch("http://localhost:5555/chairs", {
            method: 'GET',
            contentType: 'application/json',
            // headers: {
            //     'Authorization': 'Bearer {{token}}'
            // },
        })
        if(!response.ok){
            console.log(await response.text());
        }
        //console.log(await response.json());
        return response.json();

    }
    async function refreshChairs(){
        chairs = await getChairs();
        console.log(chairs);
    }
    refreshChairs();

    async function goToChair(chair_id){
        await currentChairId.set(chair_id);
        console.log($currentChairId);
        router.redirect("/chairinfo");
    }


</script>

<section>
<ul id="chairs"{refreshChairs}>
    {#each chairs as chair}
    <li style="background-color: {chair.color}">{chair.name}
        <button type="button" id="moreInfoButton"
                on:click={() => goToChair(chair.id)}>More info</button>
    </li>
    {/each}
</ul>
</section>




<style>
    section{
        width: 100vw;
        display: flex;
        justify-content: center;
    }

    #chairs{
        display: flex;
        margin-inline: 0;
        padding: 0;
        flex-flow: row;
        flex-wrap: wrap;
        list-style: none;
    }

    #moreInfoButton{
        display: block;
        position: absolute;
        bottom: 0;
        left: 33%;

    }

    #chairs li{
        position: relative;
        margin: 10px;
        width: 200px;
        height: 200px;
    }
</style>