<script lang="ts">
    import {setUserPrefDarkMode} from "$lib/util/setUserPrefDarkMode";
    import ContinentData from "$lib/util/data/ContinentData";
    import CountryData from "$lib/util/data/CountryData";
    import {onMount} from "svelte";

    onMount(() => {
        setUserPrefDarkMode()
        new ContinentData().setData()
        new CountryData().setAllCountries()
    })
</script>