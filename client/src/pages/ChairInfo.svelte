<script>
    let currentChair = {};
    let bidAmount = 0;
    import {currentChairId} from "../stores.js";
    import {userId} from "../stores.js";
    import {userName} from "../stores.js";
    import {token} from "../stores.js";


    const GetChairById = async () => {
        console.log(currentChair.bids);
        console.log($currentChairId);
        const response = await fetch("http://localhost:5555/chairs/" + $currentChairId, {
            method: 'GET',
            contentType: 'application/json',
        })
        if (!response.ok) {
            console.log(await response.text());
        }
        //console.log(await response.json());
        currentChair = await response.json();
    }

    async function addBid() {
        console.log($userName)
        const date = new Date();
        const data = {
            userId: $userId,
            userName: $userName,
            chairId: $currentChairId,
            bidAmount: bidAmount,
            date: date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate()
        }
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
        await GetChairById();
        return response.json();
    }
    async function deleteBid(chairId, bidId) {
        const response = await fetch("http://localhost:5555/chairs/" + chairId + "/" + bidId, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + $token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
        if (!response.ok) {
            return console.log(await response.text());
        }
        await GetChairById()
        return response.json();

    }

    GetChairById();

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
                        {#if bid.userId === $userId}
                            <button type="button" id="deleteBidButton" on:click={() => deleteBid(chair.id, bid.bidId)}>X</button>
                        {/if}
                        <div>{bid.userName}</div>
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
        list-style: none;
    }
    #addBid{
        top: 780px;
        position: absolute;
        right: 95px;
    }
    #deleteBidButton{
        display: block;
        position: initial;
    }
    #bidAmount{
        top: 780px;
        position: absolute;
        right: 160px;
    }
    #bids li{
        margin-bottom: 20px;
        border: solid 2px black;
    }

</style>