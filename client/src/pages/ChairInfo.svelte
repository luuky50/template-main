<script>
    let currentChair = {};
    let bidAmount = 0;
    import {currentChairId} from "../stores.js";
    import {userId} from "../stores.js";
    import {token} from "../stores.js";


    const GetChairById = async () => {
        console.log($currentChairId);
        const response = await fetch("http://localhost:5555/chairs/" + $currentChairId, {
            method: 'GET',
            contentType: 'application/json',
        })
        if (!response.ok) {
            console.log(await response.text());
        }
        //console.log(await response.json());
        return response.json();
    }

    async function refreshChair() {
        currentChair = await GetChairById();
        console.log(currentChair.bids);
    }
    async function addBid() {
        console.log(bidAmount)
        const date = new Date();
        const data = {
            userId: $userId,
            chairId: $currentChairId,
            bidAmount: bidAmount,
            date: date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate()
        }
        console.log("Current token " + $token);
        console.log("New bid: " + JSON.stringify(data));
        const response = await fetch("http://localhost:5555/chairs/bid", {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + $token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data })
        })
        if (!response.ok) {

            return console.log(await response.text());
        }
        console.log("Posting bid");
        //console.log(await response.json());
        await refreshChair();
        return response.json();
    }

    refreshChair();


</script>


<form>
    {#await currentChair}
        <h1>Loading..</h1>
    {:then chair}
        <h1 id="chairName">{chair.name}</h1>
        <h1 id="chairPrice">{chair.price}</h1>
        <ul id="bids">Bids:
            {#if chair.bids}
                {#each chair.bids as bid}
                    <li>
                        <div>{bid.bidAmount}</div>
                        <div>Creation date: {bid.date}</div>
                    </li>
                {/each}
            {/if}
        </ul>
    {/await}
</form>

<input type="number" id="bidAmount" bind:value={bidAmount}>
<button type="button" id="addBid" on:click={() => addBid(bidAmount)}>Add bid</button>


<style>
    #bids {
        width: 400px;
        height: 500px;
        position: absolute;
        right: 0;
        border: solid 2px black;
    }
    #addBid{
        top: 780px;
        position: absolute;
        right: 95px;
    }
    #bidAmount{
        top: 780px;
        position: absolute;
        right: 160px;
    }
    #bids{
        list-style: none;
    }
</style>