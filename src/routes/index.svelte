<script context="module" lang="ts">
    export const prerender = true;
</script>

<script lang="ts">
    import Button from '@smui/button';
    import RandomCam from '$lib/webcam/RandomCam';
    import DataProvider from '$lib/DataProvider';
    import {randomEntry, getDistanceInKm} from '$lib/helpers';
    import Modal from '$lib/Modal.svelte';
    import SelectMap from '$lib/maps/SelectMap.svelte';
    import SelectGameMode from '$lib/SelectGameMode.svelte';
    import ScoreScreen from "$lib/components/ScoreScreen.svelte";
    import WebcamScreen from "$lib/components/WebcamScreen.svelte";

    const cam = new RandomCam();

    let country: { id: string };
    let countryLoaded = 0;
    let webcam;
    let webcamLoaded = false;
    let showModal = false;
    let selectedCoordinates;
    let actualCoordinates;
    let score;
    let webCamImage;
    let clickedStart = false;

    $: if (countryLoaded === 1) {
        countryLoaded++;
        const webcamList = new DataProvider(
            '/list/country=' + country.id + '?show=webcams:location,image,player'
        );
        webcamList
            .fetchApiContent()
            .then((data) => {
                webcam = randomEntry(data.result.webcams);
                console.log({webcam});
                webcamLoaded = true;
                return webcam;
            })
            .then((webcam) => {
                const sizes = webcam.image.sizes.preview;
                webCamImage = {
                    ...sizes,
                    current: webcam.image.current.preview,
                    daylight: webcam.image.daylight.preview
                };
            });
    }
    const resetCountry = () => {
        countryLoaded = 0;
        loadCountry();
    };

    async function setRandomCountry() {
        return await cam.getRandomCountry();
    }

    const loadCountry = () => {
        clickedStart = true;
        setRandomCountry().then((data: any) => {
            country = data;
            countryLoaded++;
        });
    };
    const handleSetCoordinates = (event) => {
        selectedCoordinates = event.detail;
        selectedCoordinates = {
            lon: parseFloat(selectedCoordinates.lon),
            lat: parseFloat(selectedCoordinates.lat)
        };
        actualCoordinates = {lon: webcam.location.longitude, lat: webcam.location.latitude};
        showModal = false;
        score = getDistanceInKm(selectedCoordinates, actualCoordinates);
    };
</script>

<svelte:head>
    <title>WebcamGuessr</title>
    <meta name="description" content="Guess where the webcam is!"/>
</svelte:head>
{#if score}
    <ScoreScreen {selectedCoordinates} {actualCoordinates} {score} {webcam}/>
{/if}
{#if !countryLoaded && !clickedStart}
    <section class="intro">
        <h1>Webcam-Guessr</h1>
        <SelectGameMode/>
        <Button on:click={loadCountry} variant="raised">Start</Button>
    </section>
{/if}
{#if clickedStart && !score}
    <WebcamScreen
            on:modalShow={() =>{showModal=true}}
            on:resetGame={resetCountry}
            {countryLoaded}
            {webcamLoaded}
            {webcam}
            {webCamImage}
    />
{/if}
{#if showModal}
    <section>
        <Modal on:close={() => (showModal = false)}>
            <h2 slot="header">Place Marker</h2>
            <SelectMap on:setCoordinates={handleSetCoordinates}/>
        </Modal>
    </section>
{/if}

