<script>
    let chairName = "";
    let chairDescription = "";
    let chairColor = "";
    let chairPrice = "";
    let chairDate = "";

</script>


<div class="chair-modal-container">
    <div class="chair-modal-content">
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
    </div>
</div>


<style>
    .chair-modal-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .chair-modal-content {
        width: 400px;
        height: 400px;
        background-color: white;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
</style>