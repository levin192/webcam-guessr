<script lang="ts">
    import Fab, {Icon} from '@smui/fab';
    import Button from '@smui/button';
    import LoadingOverlay from '$lib/components/LoadingOverlay.svelte';
    import {fade} from 'svelte/transition';
    import {createEventDispatcher} from 'svelte';

    const dispatch = createEventDispatcher()

    export let countryLoaded
    export let webcamLoaded
    export let webcam
    export let webCamImage

    let showWebcam = false;
    let showDayTime = false;

    const toggleShowDayTime = () => {
        showWebcam = false;
        showDayTime = !showDayTime;
    };
    const toggleShowWebcam = () => {
        showWebcam = !showWebcam;
    };
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
                {:else if webCamImage}
                    {#if showDayTime}
                        <img
                                src={webCamImage.daylight}
                                alt="webcam"
                                width={webCamImage.width}
                                height={webCamImage.height}
                        />
                    {:else}
                        <img
                                src={webCamImage.current}
                                alt="webcam"
                                width={webCamImage.width}
                                height={webCamImage.height}
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
                <Button on:click={() => dispatch('resetGame')}>Reset</Button>
            </div>
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