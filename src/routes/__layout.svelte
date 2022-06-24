<script lang="ts">
    import Header from '$lib/header/Header.svelte';
    import {setUserPrefDarkMode} from "$lib/setUserPrefDarkMode";
    import ContinentData from "$lib/ContinentData";
    import {onMount} from "svelte";
    onMount(() => {
        setUserPrefDarkMode()
        new ContinentData().setData()
    })

</script>

<Header/>

<main>
    <slot/>
</main>

<footer>

</footer>

<style>
    main {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        width: 100%;
        max-width: 100%;
        margin: 0 auto;
        box-sizing: border-box;
    }

    footer {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 40px;
    }
</style>
