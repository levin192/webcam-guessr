<script lang="ts">
    import Fab, {Icon} from '@smui/fab';
    import IconButton from '@smui/icon-button'
    import type {SnackbarComponentDev} from '@smui/snackbar';
    import Snackbar, {Actions, Label} from '@smui/snackbar';
    import Button from '@smui/button';
    import LoadingOverlay from '$lib/components/LoadingOverlay.svelte';
    import {gameState} from "$lib/store";
    import {fade} from 'svelte/transition';
    import {createEventDispatcher} from 'svelte';


    const dispatch = createEventDispatcher()

    export let countryLoaded
    export let webcamLoaded
    export let webcam
    export let webcamImage

    let showWebcam = false;
    let showDayTime = false;

    let storeGameState
    let resetInfoSnackbar: SnackbarComponentDev;

    const toggleShowDayTime = () => {
        showWebcam = false;
        showDayTime = !showDayTime;
    };
    const toggleShowWebcam = () => {
        showWebcam = !showWebcam;
    };

    const handleResetClick = () => {
        if (storeGameState.resetCount == 2) {
            resetInfoSnackbar.open()
        }
        dispatch('resetGame')
    }

    gameState.subscribe(value => {
        storeGameState = value;
    });
</script>

<section class="webcam-section" transition:fade>
    {#if countryLoaded && webcamLoaded}
        <div>
            <h1>Where is this?</h1>
        </div>
        <div class="webcam-wrapper" transition:fade>
            <div class="webcam-actions">
                <Fab color="primary" mini on:click={toggleShowDayTime}>
                    <Icon class="material-icons">brightness_6</Icon>
                </Fab>
                <Fab color="primary" mini on:click={toggleShowWebcam}>
                    <Icon class="material-icons">videocam</Icon>
                </Fab>
            </div>
            {#if webcamLoaded}
                {#if showWebcam}
                    <iframe title="the cam" height="430px" width="100%" src={webcam.player.day.embed}></iframe>
                {:else if webcamImage}
                    {#if showDayTime}
                        <img
                                src={webcamImage.daylight}
                                alt="webcam"
                                width={webcamImage.width}
                                height={webcamImage.height}
                        />
                    {:else}
                        <img
                                src={webcamImage.current}
                                alt="webcam"
                                width={webcamImage.width}
                                height={webcamImage.height}
                        />
                    {/if}
                {/if}
                <div class="webcam-info">
                    Webcams provided by <a href="https://www.windy.com/" target="_blank">windy.com</a>
                    &mdash; <a href="https://www.windy.com/webcams/add" target="_blank">add a webcam</a>
                </div>
            {/if}
            <div class="actions-buttons-wrap">
                <Button on:click={() => dispatch('modalShow')} variant="raised">Show Map</Button>
                <Button disabled={storeGameState.resetCount >= 3} on:click={handleResetClick}>
                    Reset {storeGameState.resetCount}/3
                </Button>
            </div>
            <Snackbar bind:this={resetInfoSnackbar}>
                <Label>Max amount of resets used!</Label>
                <Actions>
                    <IconButton class="material-icons" title="Dismiss">close</IconButton>
                </Actions>
            </Snackbar>
        </div>
    {:else}
        <div transition:fade>
            <LoadingOverlay/>
        </div>
    {/if}
</section>

<style lang="scss">
  .webcam-wrapper {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    @media (min-width: 900px) {
      max-width: 767px;
    }

    img {
      width: 100%;
      height: auto;
    }

    .webcam-actions {
      position: absolute;
      top: 5px;
      right: 5px;
    }

    .actions-buttons-wrap {
      margin-top: 1rem;
      margin-left: auto;
    }
  }

  .webcam-info {
    text-align: right;
    font-size: .8rem;
    margin-top: 2px;
    margin-bottom: 5px;
  }
</style>