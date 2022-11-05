
<script>

    import {filters} from "../stores.js";
    let colors = [];
    let selectedColor;
    let currentFilters = [];

    function addFilters(){
        for (const filter of currentFilters) {
            filters.update(f => f + filter.type + "=" + filter.value)
        }
        console.log($filters);
    }

    function removeFilter(type, value){
        if($filters.includes(type)) {
            console.log($filters)
            filters.update(t =>
                t.replace(type + "=" + value, "")
            )
            console.log($filters)
        }
    }


</script>


<div id="sidebar">
    <h1 style="font-size: 20px">Select your filters</h1>
    <div class="textSideBar">Color picker:</div>
    <select id="chairColorPicker" bind:value={selectedColor}>
        <!--{#each colors as color}-->
            <option>orange</option>
            <option>red</option>
        <!--{/each}-->
    </select>

    <div class="textSideBar">Minimum price point</div>
    <input type="number">

    <div class="textSideBar">Date before</div>
    <input id="date" type="date">

    <button>Add filters</button>

    <div class="textSideBar">Search bar</div>
    <input type="text">

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