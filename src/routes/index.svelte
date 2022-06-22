<script context="module" lang="ts">
    export const prerender = true;
</script>

<script lang="ts">
    import Button from '@smui/button';
    import Fab, {Icon} from '@smui/fab';
    import RandomCam from "$lib/webcam/RandomCam";
    import DataProvider from "$lib/DataProvider";
    import {randomEntry, getDistanceInKm, valuesToArray} from "$lib/helpers";
    import Modal from '$lib/Modal.svelte';
    import SelectMap from '$lib/SelectMap.svelte'
    import SolvedMap from '$lib/SolvedMap.svelte'
    import LoadingOverlay from '$lib/LoadingOverlay.svelte'
    import {fly, fade} from 'svelte/transition';

    const cam = new RandomCam()

    let country;
    let countryLoaded = 0
    let webcam;
    let webcamLoaded = false;
    let showModal = false;
    let selectedCoordinates;
    let actualCoordinates;
    let score;
    let webCamImage;
    let clickedStart = false;
    let showWebcam = false;
    let showDayTime = false;

    const toggleShowDayTime = () => {
        showWebcam = false
        showDayTime = !showDayTime
    }
    const toggleShowWebcam = () => {
        showWebcam = !showWebcam
    }

    $: if (countryLoaded === 1) {
        countryLoaded++
        const webcamList = new DataProvider('/list/country=' + country.id + '?show=webcams:location,image,player')
        webcamList.fetchApiContent().then(data => {
            webcam = randomEntry(data.result.webcams)
            console.log({webcam})
            webcamLoaded = true
            return webcam
        }).then(webcam => {
            const sizes = webcam.image.sizes.preview
            webCamImage = {
                ...sizes,
                current: webcam.image.current.preview,
                daylight: webcam.image.daylight.preview
            }
        })
    }
    const resetCountry = () => {
        countryLoaded = 0
        loadCountry()
    }

    async function setRandomCountry() {
        return await cam.getRandomCountry()
    }

    const loadCountry = () => {
        clickedStart = true;
        setRandomCountry().then((data: any) => {
            country = data
            countryLoaded++
        })
    }
    const handleSetCoordinates = (event) => {
        selectedCoordinates = event.detail
        selectedCoordinates = {
            lon: parseFloat(selectedCoordinates.lon),
            lat: parseFloat(selectedCoordinates.lat)
        }
        actualCoordinates = {lon: webcam.location.longitude, lat: webcam.location.latitude }
        showModal = false
        score = getDistanceInKm(selectedCoordinates, actualCoordinates) + 'km'
    }


</script>

<svelte:head>
    <title>WebcamGuessr</title>
    <meta name="description" content="Guess where the webcam is!"/>
</svelte:head>
<div class="the-game">
    {#if score }
        <section class="score-section" transition:fly="{{ y: 200, duration: 1800 }}">
            <SolvedMap
                    coordsClicked="{valuesToArray(selectedCoordinates)}"
                    coordsSolution="{valuesToArray(actualCoordinates)}"
            />
            <h1>Distance: {score}</h1>
            <h2>The Webcam is in: {webcam.location.city}, {webcam.location.country}</h2>
            <Button on:click={()=>{window.location.reload()}}>Restart</Button>
        </section>
    {/if}
    {#if !countryLoaded && !clickedStart}
        <section class="intro">
            <h1>Webcam-Guessr</h1>
            <Button on:click={loadCountry} variant="raised">Start</Button>
        </section>
    {/if}
    {#if clickedStart && !score}
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
                    {#if webcamLoaded }
                        {#if showWebcam}
                            <iframe title="the cam" height="430px" width="100%"
                                    src="{webcam.player.day.embed}"></iframe>
                        {:else if webCamImage}
                            {#if showDayTime}
                                <img src="{webCamImage.daylight}" alt="webcam" width="{webCamImage.width}"
                                     height="{webCamImage.height}">
                            {:else}
                                <img src="{webCamImage.current}" alt="webcam" width="{webCamImage.width}"
                                     height="{webCamImage.height}">
                            {/if}
                        {/if}
                    {/if}
                    <div class="actions-buttons-wrap">
                        <Button on:click="{() => showModal = true}" variant="raised">
                            Show Map
                        </Button>
                        <Button on:click={resetCountry}>Reset</Button>
                    </div>
                </div>
            {:else}
                <div transition:fade>
                    <LoadingOverlay/>
                </div>
            {/if}
        </section>
    {/if}
    {#if showModal}
        <section>
            <Modal on:close="{() => showModal = false}">
                <h2 slot="header">
                    Place Marker
                </h2>
                <SelectMap on:setCoordinates={handleSetCoordinates}/>
            </Modal>
        </section>
    {/if}
</div>

<style lang="scss">
  .the-game {
    max-height: 100vh;
    min-height: 99vh;
    display: flex;
    flex-direction: column;
  }

  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;

    &.intro {
      height: 100%;
    }

    &.score-section {
      width: 100%;
      background: aliceblue;
      position: absolute;
      height: 100%;
      left: 0;
      top: 0;
      overflow: hidden;
    }
  }

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

</style>
