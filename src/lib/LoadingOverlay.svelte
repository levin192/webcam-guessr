<script lang="ts">
    import CircularProgress from '@smui/circular-progress';
</script>

<div>
    <CircularProgress style="height: 32px; width: 32px;" indeterminate/>
</div>

<style>
    div {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>