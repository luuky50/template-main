<script>
    let currentChair = {};
    let bidAmount = 0;
    import {currentChairId} from "../stores.js";
    import {userId} from "../stores.js";
    import {userName} from "../stores.js";
    import {token} from "../stores.js";


    const GetChairById = async () => {
        if(!$currentChairId){
            alert("Current chair doesn't have a valid id: " + $currentChairId)
        }
        const response = await fetch("http://localhost:5555/chairs/" + $currentChairId, {
            method: 'GET',
            contentType: 'application/json',
        })
        if (!response.ok) {
            return alert(await response.text());
        }
        currentChair = await response.json();
    }

    async function addBid() {
        if(bidAmount <= 0){
            return alert({ errorMessage:"Bid can't be equal or lower than 0"})
        }
        if(!$userId){
            return alert({errorMessage: "UserId is " + $userId});
        }
        if(!$userName){
            return alert({errorMessage: "UserName is " + $userName});
        }
        if(!$currentChairId){
            return alert({errorMessage: "CurrentChairId is " + $currentChairId});
        }

        const date = new Date();
        const data = {
            userId: $userId,
            userName: $userName,
            chairId: $currentChairId,
            bidAmount: bidAmount,
            date: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
        }
        const response = await fetch("http://localhost:5555/chairs/bid", {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + $token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({data})
        })
        if (!response.ok) {

            return alert(await response.text());
        }
        await response.json();
        await GetChairById();

    }

    async function deleteBid(chairId, bidId) {
        if(!chairId){
            return alert({errorMessage: "ChairId id is " + chairId});
        }
        if(!bidId){
            return alert({errorMessage: "BidId id is " + bidId});
        }
        const response = await fetch("http://localhost:5555/chairs/" + chairId + "/" + bidId, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + $token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
        if (!response.ok) {
            return alert(await response.text());
        }
        await response.json();
        await GetChairById()

    }

    GetChairById();

</script>


<form>
    {#await currentChair}
        <h1>Loading..</h1>
    {:then chair}
        <h1 id="chairName">{chair.name}</h1>
        <h1 id="chairPrice">Starting price: {chair.price}</h1>
        <h1 id="chairEndDate">Ends on: {chair.endsBy}</h1>
        <div id="chairDescription">Description: {chair.description}</div>
        <ul id="bids">Bids:
            {#if chair.bids}
                {#each chair.bids as bid}
                    <li>
                        {#if bid.userId === $userId}
                            <button type="button" id="deleteBidButton" on:click={() => deleteBid(chair.id, bid.bidId)}>
                                X
                            </button>
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

    #addBid {
        top: 780px;
        position: absolute;
        right: 95px;
    }

    #deleteBidButton {
        display: block;
        position: initial;
    }

    #bidAmount {
        top: 780px;
        position: absolute;
        right: 160px;
    }

    #bids li {
        margin-bottom: 20px;
        border: solid 2px black;
    }

</style>