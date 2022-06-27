<script lang="ts">
    import {setUserPrefDarkMode} from "$lib/util/setUserPrefDarkMode";
    import ContinentData from "$lib/util/data/ContinentData";
    import CountryData from "$lib/util/data/CountryData";
    import {onMount} from "svelte";
    import HeaderScore from "$lib/header/HeaderScore.svelte";

    onMount(() => {
        setUserPrefDarkMode()
        new ContinentData().setData()
        new CountryData().setAllCountries()
    })
</script>
<header>
    <HeaderScore/>
</header>
<style lang="scss">
  header {
    width: 100%;
    margin: auto;
    @media (min-width: 900px) {
      max-width: 767px;
    }
  }
</style>