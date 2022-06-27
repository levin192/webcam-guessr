<script lang="ts">
    import {fly} from 'svelte/transition';
    import Button from '@smui/button';
    import {valuesToArray} from '$lib/util/helpers';
    import SolvedMap from '$lib/maps/SolvedMap.svelte';
    import {createEventDispatcher} from 'svelte';

    const dispatch = createEventDispatcher()

    export let selectedCoordinates
    export let actualCoordinates
    export let score
    export let webCam

    const calcScorePoints = (km: number) => {
        let kmToScore = (1000 / (km + 1000)) * 1000;
        return Math.round(kmToScore);
    };
</script>

<section transition:fly={{ y: -200, duration: 1800 }}>
    <SolvedMap
            coordsClicked={valuesToArray(selectedCoordinates)}
            coordsSolution={valuesToArray(actualCoordinates)}
    />
    <h1>Score: {calcScorePoints(score)}/1000</h1>
    <b>Distance: {score}km</b>
    <h2>The Webcam is in: {webCam.location.city}, {webCam.location.country}</h2>
    <Button on:click={() => dispatch('resetGame')}>Next</Button>
    <Button
            on:click={() => {
					window.location.reload();
				}}>Restart
    </Button>
</section>

<style lang="scss">
  section {
    position: absolute;
    inset: 0;

    h2 {
      padding: 0 15px;
    }
  }
</style>