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


<div class="container">
    <FilterSideBar on:hasFilters={getChairs} />
    <div class="chairs-grid" {getChairs}>
        {#each chairs as chair}
            <div class="chair" style="background-color: {chair.color}">
                {#if $isAdmin}
                    <div class="admin-buttons-container">
                        <button class="admin-button" on:click={() => enableEditChairMenu(chair.id)}>⚙️</button>
                        <button class="admin-button" on:click={() => deleteChair(chair.id)}>❌</button>
                    </div>
                {/if}
                <span>{chair.name}</span>
                <button class="more-info-button" on:click={() => goToChair(chair.id)}>More info</button>
            </div>
        {/each}
        {#if $isAdmin}
            <button class="add-chair-button" on:click={enableCreateChairMenu}>+</button>
        {/if}
    </div>

    {#if showChair && isEditChair}
        {#await getChair(currentChairId)}
            <ChairMenu/>
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

</div>


<style>
    .container {
        display: grid;
        grid-template-columns: 1fr 4fr;
    }

    .chairs-grid {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        padding: 1rem;
    }

    @media (max-width: 768px) {
        .container {
            grid-template-columns: 1fr;
        }

        .chairs-grid {
            justify-content: center;
        }
    }

    .chair {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        height: 300px;
        width: 300px;
        border: 1px solid black;
        border-radius: 10px;
        padding: 10px;
        margin: 10px;
    }

    .admin-buttons-container {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }

    .admin-button {
        border: none;
        background-color: transparent;
        color: white;
        font-size: 20px;
        cursor: pointer;
    }

    .cancelButton {
        display: block;
        position: absolute;
        right: 0;
        top: 0;
    }

    .more-info-button {
        border-radius: 1rem;
        font-size: 1rem;
        padding: 1rem;
        cursor: pointer;
    }

    .more-info-button:hover {
        background-color: #444;
        color: white;
        transition: all 0.2s ease-in-out;
    }

    .add-chair-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        height: 50px;
        width: 50px;
        border-radius: 100%;
        padding: 10px;
        cursor: pointer;
        font-size: 24px;
        font-weight: bold;
    }
</style>