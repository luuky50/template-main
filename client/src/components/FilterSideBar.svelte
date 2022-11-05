
<script>
    import {filters} from "../stores.js";
    import router from "page";
    import {createEventDispatcher} from "svelte";
    let colors = [];
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
        console.log($filters);
    }


</script>


<div id="sidebar">
    <h1 style="font-size: 20px">Select your filters</h1>
    <div class="textSideBar">Color picker:</div>
    <select id="chairColorPicker" bind:value={selectedColor}>
        <!--{#each colors as color}-->
            <option selected="selected">all</option>
            <option>orange</option>
            <option>red</option>
        <!--{/each}-->
    </select>

    <div class="textSideBar" >Price</div>
    <input type="number" bind:value={selectedPrice}>

    <div class="textSideBar">Ends by</div>
    <input id="date" type="date" bind:value={selectedEndsBy}>

    <button on:click={() => addFilters(true)}>Filter</button>

    <div class="textSideBar">Search bar</div>
    <input type="text" bind:value={searchTerm}>
    <button on:click={() => addFilters(false)}>Search</button>

</div>

<style>
    #sidebar{
        height: 500px;
        width: 200px;
        position: fixed;
        display: block;
        margin: 0;
        padding: 0;
    }
    #chairColorPicker{
        width: 90%;
    }

    .textSideBar{
        text-align: left;
        margin-top: 10px;
        margin-left: 13px;
    }

    #date{
        width: 85%;
    }
</style>