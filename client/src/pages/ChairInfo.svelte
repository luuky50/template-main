<script>
    let currentChair = {};
    import {currentChairId} from "../stores.js";


    const GetChairById = async () => {
        console.log($currentChairId);
        const response = await fetch("http://localhost:5555/chairs/" + $currentChairId,{
            method: 'GET',
            contentType: 'application/json',
        })
        if(!response.ok){
            console.log(await response.text());
        }
        //console.log(await response.json());
        return response.json();
    }
    async function RefreshChair(){
        currentChair = await GetChairById();
        console.log(currentChair);
    }
    RefreshChair();
</script>


<form>
    {#await currentChair}
        {:then chair}
        <a>{chair.name}</a>
    {/await}
</form>