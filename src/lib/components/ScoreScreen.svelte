<script lang="ts">
    import {fly} from 'svelte/transition';
    import Button from '@smui/button';
    import {valuesToArray} from '$lib/util/helpers';
    import SolvedMap from '$lib/maps/SolvedMap.svelte';
    import DetailResult from '$lib/components/DetailResult.svelte';
    import {createEventDispatcher} from 'svelte';
    import {gameState, maxRounds} from "../store";

    const dispatch = createEventDispatcher()

    export let selectedCoordinates
    export let actualCoordinates
    export let score
    export let webcam
    export let finalCoordsRegistered

    let storeGameState
    let maxRoundsStore

    let final = false
    const calcScorePoints = (km: number) => {
        let kmToScore = (1000 / (km + 1000)) * 1000;
        return Math.round(kmToScore);
    };


    const handleNextClick = () => {
        updateGameState()
        dispatch('resetGame')
    }

    const updateGameState = () => {
        const result = {
            ...webcam.location,
            scored: calcScorePoints(score),
            distance: score,
            roundNumber: storeGameState.currentRound,
            thumb: webcam.image.current.thumbnail,
            preview: webcam.image.current.preview
        }
        gameState.update(n => {
            if (!final)
                n.currentRound++
            n.results.push(result)
            n.totalScore = n.totalScore + calcScorePoints(score)
            return n
        })
    }

    gameState.subscribe(value => {
        storeGameState = value;
    });

    maxRounds.subscribe(value => {
        maxRoundsStore = value
    })

    $: if (storeGameState.currentRound === maxRoundsStore) {
        dispatch('finalRound')
        final = true
    }
    $: if (finalCoordsRegistered) {
        updateGameState()
    }
</script>

<section transition:fly={{ y: -200, duration: 1800 }}>
    {#if storeGameState.currentRound >= maxRoundsStore }
        <h1>🎉 Game Over 🎉 </h1>
        <h2>Total Score: {storeGameState.totalScore}</h2>
        <DetailResult gameState="{storeGameState}"/>
    {/if}
    <SolvedMap
            coordsClicked={valuesToArray(selectedCoordinates)}
            coordsSolution={valuesToArray(actualCoordinates)}
    />
    <h1>Score: {calcScorePoints(score)}/1000</h1>
    <b>Distance: {score}km</b>
    <h2>The Webcam is in: {webcam.location.city}, {webcam.location.country}</h2>
    {#if storeGameState.currentRound < maxRoundsStore }
        <Button on:click={() => handleNextClick()}>Next</Button>
    {/if}
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