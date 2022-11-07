
<script>
    import {filters, colors} from "../stores.js";
    import {createEventDispatcher} from "svelte";
    let selectedColor;
    let selectedPrice;
    let selectedEndsBy;
    let searchTerm;

    const dispatch = createEventDispatcher();

    function addFilters(isFilter){
        filters.set("?");
        if(isFilter) {
            if (selectedColor !== "all") {
                filters.update(f => f + "color" + "=" + selectedColor)
                if(selectedPrice)
                    filters.update(f => f + "&")
            }
            if (selectedPrice) {
                filters.update(f => f + "price" + "=" + selectedPrice)
                if(selectedEndsBy)
                    filters.update(f => f + "&")
            }
            if (selectedEndsBy) {
                filters.update(f => f + "endsBy" + "=" + selectedEndsBy)
            }
        }else{
            if(searchTerm){
                filters.update(f => f +  "search" + "=" + searchTerm)
            }
        }
        dispatch('hasFilters');
    }


</script>


<div class="filters">
    <h1 class="filters-title">Select your filters</h1>
    <div class="form-group">
        <label class="input-label" for="color-picker">Color picker:</label>
        <select class="color-picker" id="color-picker" bind:value={selectedColor}>
            <option selected="selected">all</option>
            {#each colors as color}
            <option>{color}</option>
            {/each}
        </select>
    </div>

    <div class="form-group">
        <label class="input-label" for="price-selector">Price</label>
        <input class="form-input" id="price-selector" type="number" bind:value={selectedPrice}>
    </div>

    <div class="form-group">
        <label class="input-label" for="date-input">Ends by</label>
        <input id="date-input" class="form-input" type="date" bind:value={selectedEndsBy}>
    </div>

    <div class="form-group">
        <button class="form-button" on:click={() => addFilters(true)}>Filter</button>
    </div>

    <div class="form-group">
        <label class="input-label" for="search-input">Search bar</label>
        <input id="search-input" class="form-input" type="text" bind:value={searchTerm}>
    </div>

    <div class="form-group">
        <button class="form-button" on:click={() => addFilters(false)}>Search</button>
    </div>

</div>

<style>
    .filters {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        background-color: #f2f2f2;
        padding: 20px;
        border-radius: 10px;
    }

    @media only screen and (max-width: 768px) {
        .filters {
            border-radius: 0;
            align-items: center;
        }
    }

    .filters-title {
        font-size: 20px;
        font-weight: bold;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;
    }

    .input-label {
        margin-bottom: 5px;
    }

    .color-picker {
        width: 200px;
        height: 40px;
        border-radius: 5px;
        border: 1px solid #ccc;
        padding: 0 10px;
    }

    .form-input {
        width: 178px;
        height: 38px;
        border-radius: 5px;
        border: 1px solid #ccc;
        padding: 0 10px;
    }

    .form-button {
        width: 200px;
        height: 40px;
        border-radius: 5px;
        border: 1px solid #ccc;
        padding: 0 10px;
        background-color: #ccc;
        cursor: pointer;
    }
</style>