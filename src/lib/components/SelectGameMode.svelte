<script lang="ts">
    import Select, {Option} from '@smui/select';
    import Autocomplete from '@smui-extra/autocomplete';
    import {onMount} from "svelte";
    import ContinentData from "$lib/util/data/ContinentData";
    import CountryData from "$lib/util/data/CountryData";

    let gameMode = ['World', 'Continent', 'Country'];
    let value = 'World';
    let continents
    let selectedContinent
    let countries
    let selectedCountry

    onMount(() => {
        new ContinentData().getData().then(data => {
            continents = data.map(item => item.name)
        })
        new CountryData().getAllCountries().then(data => {
            countries = data
        })
    })


</script>

<div>
    <Select bind:value label="Select Game Mode">
        {#each gameMode as mode}
            <Option value={mode}>{mode}</Option>
        {/each}
    </Select>
</div>
{#if value === 'Continent'}
    <div>
        <!-- ToDo: use select here -->
        <Autocomplete
                options={continents}
                bind:value={selectedContinent}
                label="Select Continent"
        />
    </div>
{/if}
{#if value === 'Country' && countries.length}
    <Autocomplete
            options={countries}
            getOptionLabel={(country) =>
            country ? `${country.name} (${country.id})` : ''}
            bind:selectedCountry
            label="Select Country"
    />

{/if}
