<script>
    import router from "page";
    import {currentChairId, isAdmin, token, filters} from "../stores.js";
    import ChairMenu from "../components/ChairMenu.svelte"
    import FilterSideBar from "../components/FilterSideBar.svelte";
    import {createEventDispatcher} from "svelte";

    export let params;
    let chairs = [];
    let showChair = false;
    let isEditChair = false;

    let chairObject = {
        chairName: "",
        chairDescription: "",
        chairColor: "",
        chairPrice: 0,
        chairDate: ""
    }


    const getChairs = async () => {
        const response = await fetch("http://localhost:5555/chairs/" + $filters, {
            method: 'GET',
            contentType: 'application/json',
        })
        if (!response.ok) {
            console.log(await response.text());
        }
        //console.log(await response.json());
        chairs = await response.json();
    }

    const deleteChair = async (chairId) => {
        const response = await fetch("http://localhost:5555/chairs/" + chairId, {
            method: 'DELETE',
            contentType: 'application/json',
        })
        if (!response.ok) {
            console.log(await response.text());
        }
        //console.log(await response.json());
        console.log(await response.json());
        await getChairs();
    }

    const createChair = async (data) => {
        console.log(data);
        const response = await fetch("http://localhost:5555/chairs", {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + $token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({data})
        })
        if (!response.ok) {

            return console.log(await response.text());
        }
        chairs.push(data);
        await response.json();
        await getChairs()
        toggleChairMenu()
    }

    async function compareData(oldData, newData) {
        return {
            id: oldData.id,
            name: !newData.chairName ? oldData.name : newData.chairName,
            description: !newData.chairDescription ? oldData.description : newData.chairDescription,
            color: !newData.chairColor ? oldData.color : newData.chairColor,
            price: newData.chairPrice === 0 ? oldData.price : newData.chairPrice,
            bids: oldData.bids,
            endsBy: !newData.chairDate ? oldData.endsBy : newData.chairDate
        };
    }

    const saveChair = async (oldData, newData) => {
        let data = []
        data = await compareData(oldData, newData);
        console.log(data);
        const response = await fetch("http://localhost:5555/chairs/", {
            method: 'PUT',
            mode: "cors",
            headers: {
                'Authorization': 'Bearer ' + $token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({data})
        })
        if (!response.ok) {
            return console.log(await response.text());
        }
        await response;
        await getChairs()
        toggleChairMenu()
    }

    filters.set("");
    getChairs();


    async function goToChair(chair_id) {
        await currentChairId.set(chair_id);
        console.log($currentChairId);
        router.redirect("/chairinfo");
    }

    function toggleChairMenu() {
        showChair = !showChair;
    }

    function enableCreateChairMenu() {
        isEditChair = false;
        toggleChairMenu();
    }

    async function enableEditChairMenu(id) {
        await currentChairId.set(id);
        isEditChair = true;
        toggleChairMenu();
    }

    async function getChair() {
        console.log($currentChairId);
        const response = await fetch("http://localhost:5555/chairs/" + $currentChairId, {
            method: 'GET',
            contentType: 'application/json',
        })
        if (!response.ok) {
            return console.log(await response.text());
        }
        //console.log(await response.json());
        return response.json();
    }


</script>


<section>
    <FilterSideBar on:hasFilters={getChairs}>

    </FilterSideBar>


    <ul id="chairs" {getChairs}>
        {#each chairs as chair}
            <li style="background-color: {chair.color}">{chair.name}
                {#if $isAdmin}
                    <button type="button" id="editChairButton" on:click={() => enableEditChairMenu(chair.id)}>⚙️
                    </button>
                    <button type="button" id="deleteChairButton" on:click={() => deleteChair(chair.id)}>X</button>
                {/if}
                <button
                        type="button" id="moreInfoButton" on:click={() => goToChair(chair.id)}>More info
                </button>
            </li>
        {/each}
        {#if $isAdmin}
            <li style="background-color: {'grey'}">
                <button id="addChairButton" on:click={enableCreateChairMenu}>+</button>
            </li>
        {/if}
    </ul>

    {#if showChair && isEditChair}
        {#await getChair(currentChairId)}
            <ChairMenu>
            </ChairMenu>
        {:then oldChair}
            {#if oldChair}
                <ChairMenu>
                    <button slot="cancelButton" class="cancelButton" on:click={toggleChairMenu}>X</button>
                    <h1 slot="title">Editing a chair auction</h1>
                    <input slot="chairName" placeholder={oldChair.name} bind:value={chairObject.chairName}>>
                    <input slot="chairDescription" placeholder={oldChair.description}
                           bind:value={chairObject.chairDescription}>>
                    <input slot="chairColor" placeholder={oldChair.color} bind:value={chairObject.chairColor}>>
                    <input slot="chairPrice" type="number" placeholder={oldChair.price}
                           bind:value={chairObject.chairPrice}>>
                    <input slot="chairDate" type="text" placeholder={oldChair.endsBy} onfocus="(this.type = 'date')"
                           id="date" bind:value={chairObject.chairDate}>>
                    <button slot="saveChair" type="button" on:click={() => saveChair(oldChair, chairObject)}>Save
                    </button>
                </ChairMenu>
            {/if}
        {/await}
    {:else if showChair & !isEditChair}
        <ChairMenu>
            <button slot="cancelButton" class="cancelButton" on:click={toggleChairMenu}>X</button>
            <h1 slot="title">Creating a new chair auction</h1>
            <input slot="chairName" placeholder="" bind:value={chairObject.chairName}>
            <input slot="chairDescription" placeholder="" bind:value={chairObject.chairDescription}>
            <input slot="chairColor" placeholder="" bind:value={chairObject.chairColor}>
            <input slot="chairPrice" type="number" placeholder="" bind:value={chairObject.chairPrice}>
            <input slot="chairDate" type="date" placeholder="" bind:value={chairObject.chairDate}>
            <button slot="saveChair" type="button" on:click={() => createChair(chairObject)}>Create</button>
        </ChairMenu>
    {/if}

</section>


<style>

    .cancelButton {
        display: block;
        position: absolute;
        right: 0;
        top: 0;
    }

    section {
        width: 100vw;
        display: flex;
        position: relative;
    }

    #chairs {
        display: flex;
        position: relative;
        margin-inline: 0;
        padding: 0;
        flex-flow: row;
        flex-wrap: wrap;
        list-style: none;
        margin-left: 200px
    }

    #moreInfoButton {
        display: block;
        position: absolute;
        bottom: 0;
        left: 33%;

    }

    #chairs li {
        position: relative;
        margin: 10px;
        width: 200px;
        height: 200px;
    }

    #addChairButton {
        width: 100%;
        height: 100%;
        font-size: 100px;
    }

    #deleteChairButton {
        display: block;
        position: absolute;
        right: 0;
        top: 0;
    }

    #editChairButton {
        display: block;
        position: absolute;
        left: 0;
        top: 0;
    }
</style>