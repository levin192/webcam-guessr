<script lang="ts">
    import Select, {Option} from '@smui/select';

    let gameMode = ['World', 'Continent', 'Country'];

    let value = 'World';
</script>

<div>
    <Select bind:value label="Select Game Mode">
        {#each gameMode as mode}
            <Option value={mode}>{mode}</Option>
        {/each}
    </Select>
    {#if value === 'Continent' || value === 'Country'}

    {/if}
</div>
