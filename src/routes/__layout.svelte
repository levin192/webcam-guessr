<script lang="ts">
    import Header from '$lib/header/Header.svelte';
</script>

<Header/>

<main>
    <slot/>
</main>

<footer>

</footer>

<style lang="scss">
    main {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 1rem;
        width: 100%;
        max-width: 100%;
        margin: 0 auto;
        min-height: 99vh;
        @media (min-width: 900px) {
            max-height: 100vh;
        }
    }

    footer {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 40px;
    }
</style>
