
<script>
    export let params;

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

</script>

<section>
<ul id="chairs"{refreshChairs}>
    {#each chairs as chair}
    <li id={chair.id} style="background-color: {chair.color}">{chair.name}</li>
    {/each}
</ul>
</section>




<style>
    section{
        width: 100vw;
        display: flex;
        justify-content: center;
        background-color: red;
    }

    #chairs{
        display: flex;
        margin-inline: 0;
        padding: 0;
        flex-flow: row;
        flex-wrap: wrap;
        list-style: none;
    }

    #chairs li{

        margin: 10px;
        width: 200px;
        height: 200px;
    }
</style>