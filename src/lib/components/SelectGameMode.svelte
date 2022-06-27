<script lang="ts">
    import Select, {Option} from '@smui/select';
    import Autocomplete from '@smui-extra/autocomplete';
    import {onMount} from "svelte";
    import ContinentData from "$lib/util/data/ContinentData";
    import CountryData from "$lib/util/data/CountryData";
    import {gameMode} from "../store";

    let gameModes = ['World', 'Continent', 'Country'];
    let selectedGameMode
    let continents
    let selectedContinent
    let countries
    let selectedCountry

    onMount(() => {
        new ContinentData().getData().then(data => {
            continents = data
        })
        new CountryData().getAllCountries().then(data => {
            countries = data.sort((a, b) => a.name.localeCompare(b.name))
            countries = countries.filter(a => {
               return  a.count >= 40 // Only show countries with more than 40 cams
            })
        })
    })

    gameMode.subscribe(value => {
        selectedGameMode = value.mode;
    });
    $: if (selectedCountry) {
        gameMode.set({mode: selectedGameMode, value: selectedCountry.id})
    }
    $: if (selectedContinent) {
        gameMode.set({mode: selectedGameMode, value: selectedContinent})
    }


</script>
<div>
    <div>
        <Select bind:value={selectedGameMode} label="Select Game Mode">
            {#each gameModes as mode}
                <Option value={mode}>{mode}</Option>
            {/each}
        </Select>
    </div>
    {#if selectedGameMode === 'Continent'}
        <div>
            <Select bind:value={selectedContinent} label="Select Continent">
                {#each continents as continent}
                    <Option value={continent.id}>{continent.name}</Option>
                {/each}
            </Select>

        </div>
    {/if}
    {#if selectedGameMode === 'Country' && countries.length}
        <div>
            <Autocomplete
                    options={countries}
                    getOptionLabel={(country) =>
            country ? `${country.name}` : ''}
                    bind:value={selectedCountry}
                    label="Select Country"
            />
        </div>
    {/if}
</div>

<style lang="scss">
  div {
    margin: 1rem 0
  }
</style>