<script>
    import router from "page";
    import {currentChairId, isAdmin, token, filters, colors} from "../stores.js";
    import ChairMenu from "../components/ChairMenu.svelte"
    import FilterSideBar from "../components/FilterSideBar.svelte";

    let chairs = [];
    let showChair = false;
    let isEditChair = false;

    let chairObject = {
        name: "",
        description: "",
        color: "",
        price: 0,
        endsBy: ""
    }


    const getChairs = async () => {
        const response = await fetch("http://localhost:5555/chairs/" + $filters, {
            method: 'GET',
            contentType: 'application/json',
        })
        if (!response.ok) {
            return alert(await response.text());
        }
        chairs = await response.json();
    }

    const deleteChair = async (chairId) => {
        if(!chairId){
            return alert({errorMessage: "ChairId is " + chairId});
        }
        const response = await fetch("http://localhost:5555/chairs/" + chairId, {
            method: 'DELETE',
            contentType: 'application/json',
        })
        if (!response.ok) {
            return alert(await response.text());
        }
        await getChairs();
    }

    const createChair = async (data) => {
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

            return alert(await response.text());
        }
        console.log(await response.json())
        chairs.push(data);
        await getChairs()
        toggleChairMenu()
    }

    async function compareData(oldData, newData) {
        return {
            id: oldData.id,
            name: !newData.name ? oldData.name : newData.name,
            description: !newData.description ? oldData.description : newData.description,
            color: !newData.color ? oldData.color : newData.color,
            price: newData.price === 0 ? oldData.price : newData.price,
            bids: oldData.bids,
            endsBy: !newData.endsBy ? oldData.endsBy : newData.endsBy
        };
    }

    const saveChair = async (oldData, newData) => {
        let data;
        data = await compareData(oldData, newData);
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
            return alert(await response.text());
        }
        console.log(await response.json())
        await getChairs()
        toggleChairMenu()
    }

    filters.set("");
    getChairs();


    async function goToChair(chair_id) {
        if(!chair_id){
            return alert({errorMessage: "ChairId is " + chair_id});
        }
        await currentChairId.set(chair_id);
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
        if(!id){
            alert("Chair with " + id + " doesn't exist");
        }
        await currentChairId.set(id);
        isEditChair = true;
        toggleChairMenu();
    }

    async function getChairWithId() {
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
        {#await getChairWithId(currentChairId)}
            <ChairMenu/>
        {:then oldChair}
            {#if oldChair}
                <ChairMenu>
                    <button slot="cancelButton" class="cancelButton" on:click={toggleChairMenu}>X</button>
                    <h1 slot="title">Editing a chair auction</h1>
                    <input slot="chairName" placeholder={oldChair.name} bind:value={chairObject.name}>>
                    <input slot="chairDescription" placeholder={oldChair.description}
                           bind:value={chairObject.description}>>
                    <select slot="chairColor" bind:value={chairObject.color}>
                        <option selected="selected">none</option>
                        {#each colors as color}
                        <option>{color}</option>
                        {/each}
                    </select>
                    <input slot="chairPrice" type="number" placeholder={oldChair.price}
                           bind:value={chairObject.price}>>
                    <input slot="chairDate" type="text" placeholder={oldChair.endsBy} onfocus="(this.type = 'date')"
                           id="date" bind:value={chairObject.endsBy}>>
                    <button slot="saveChair" type="button" on:click={() => saveChair(oldChair, chairObject)}>Save
                    </button>
                </ChairMenu>
            {/if}
        {/await}
    {:else if showChair & !isEditChair}
        <ChairMenu>
            <button slot="cancelButton" class="cancelButton" on:click={toggleChairMenu}>X</button>
            <h1 slot="title">Creating a new chair auction</h1>
            <input slot="chairName" placeholder="" bind:value={chairObject.name}>
            <input slot="chairDescription" placeholder="" bind:value={chairObject.description}>
            <select slot="chairColor" bind:value={chairObject.color}>
                <option selected="selected">none</option>
                {#each colors as color}
                    <option>{color}</option>
                {/each}
            </select>
            <input slot="chairPrice" type="number" placeholder="" bind:value={chairObject.price}>
            <input slot="chairDate" type="date" placeholder="" bind:value={chairObject.endsBy}>
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
        position: relative;
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