<script lang="ts">
    import {setUserPrefDarkMode} from "$lib/util/setUserPrefDarkMode";
    import ContinentData from "$lib/util/ContinentData";
    import {onMount} from "svelte";

    onMount(() => {
        setUserPrefDarkMode()
        new ContinentData().setData()
    })
</script>