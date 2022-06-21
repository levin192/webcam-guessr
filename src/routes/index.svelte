<script context="module" lang="ts">
    export const prerender = true;
</script>

<script lang="ts">
    import RandomCam from "$lib/webcam/RandomCam";
    import DataProvider from "$lib/DataProvider";
    import {randomEntry, getDistanceInKm} from "$lib/helpers";
    import Modal from '$lib/Modal.svelte';
    import SelectMap from '$lib/SelectMap.svelte'

    const cam = new RandomCam()

    let country;
    let countryLoaded = 0
    let webcam;
    let webcamLoaded = false;
    let showModal = false;
    let selectedCoordinates;
    let actualCoordinates;
    let score;


    $: if (countryLoaded === 1) {
        countryLoaded++
        const webcamList = new DataProvider('/list/country=' + country.id + '?show=webcams:location,image,player')
        webcamList.fetchApiContent().then(data => {
            webcam = randomEntry(data.result.webcams)
            console.log({webcam})
            webcamLoaded = true
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
        setRandomCountry().then((data: any) => {
            country = data
            countryLoaded++
        })
    }
    const handleSetCoordinates = (event) => {
        selectedCoordinates = event.detail
        actualCoordinates = {lat: webcam.location.latitude, lon: webcam.location.longitude}
        showModal = false
        score = getDistanceInKm(selectedCoordinates, actualCoordinates) + 'km'
    }


</script>

<svelte:head>
    <title>WebcamGuessr</title>
    <meta name="description" content="Svelte demo app"/>
</svelte:head>
{#if score }
    <section class="score-section">
        <h1>Distance: {score}</h1>
        <h2>The Webcam is in: {webcam.location.city}, {webcam.location.country}</h2>
        <button on:click={()=>{window.location.reload()}}>Restart</button>
    </section>
{/if}
<section>
    {#if webcamLoaded}
        <iframe title="the cam" height="800px" width="100%" src="{webcam.player.day.embed}"></iframe>
    {/if}
    {#if !countryLoaded}
        <button on:click={loadCountry}>Go</button>
    {/if}
    {#if countryLoaded}
        <button on:click="{() => showModal = true}">
            Show Map
        </button>
        <button on:click={resetCountry}>Reset</button>
    {/if}
</section>
<section>

</section>
<section>

    {#if showModal}
        <Modal on:close="{() => showModal = false}">
            <h2 slot="header">
                Place Marker
            </h2>

            <SelectMap on:setCoordinates={handleSetCoordinates}/>

        </Modal>
    {/if}
</section>

<style lang="scss">
    section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 1;
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
</style>
