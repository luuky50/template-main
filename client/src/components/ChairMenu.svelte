<script>
    let chairName = "";
    let chairDescription = "";
    let chairColor = "";
    let chairPrice = "";
    let chairDate = "";

</script>


<section class="chair">
    <slot name="cancelButton">X</slot>
    <slot name="title">Creating a new chair auction</slot>
    Name
    <slot name="chairName">{chairName}</slot>
    Description
    <slot name="chairDescription">{chairDescription}</slot>
    Color
    <slot name="chairColor">{chairColor}</slot>
    Price
    <slot name="chairPrice">{chairPrice}</slot>
    End Date
    <slot name="chairDate">{chairDate}</slot>
    <slot name="saveChair"></slot>
</section>

<style>
    .chair{
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        width: 400px;
        height: 400px;
        flex-flow: column;
        background-color: grey;
    }

</style>