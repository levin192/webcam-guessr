<script context="module" lang="ts">
    export const prerender = true;
</script>

<script lang="ts">
    import Button from '@smui/button';
    import {gameMode} from "$lib/store";
    import DataProvider from '$lib/util/DataProvider';
    import {randomEntry, getDistanceInKm} from '$lib/util/helpers';
    import SelectMap from '$lib/maps/SelectMap.svelte';
    import CountryData from '$lib/util/data/CountryData';
    import Modal from '$lib/components/Modal.svelte';
    import SelectGameMode from '$lib/components/SelectGameMode.svelte';
    import ScoreScreen from "$lib/components/ScoreScreen.svelte";
    import WebcamScreen from "$lib/components/WebcamScreen.svelte";



    let country: unknown;
    let countryLoaded = 0;
    let webcam: string | PromiseLike<string>;
    let webcamLoaded = false;
    let showModal = false;
    let selectedCoordinates;
    let actualCoordinates;
    let score: number;
    let webcamImage: any;
    let clickedStart = false;
    let selectedGameMode
    let fetchPath
    let staticGameMode = true
    let staticWebCamList
    let staticWebCamListLoaded = false

    const countryData = new CountryData()

    const resetCountry = () => {
        countryLoaded = 0;
        score = null
        loadCountry();
    };


    const loadCountry = () => {
        if (!selectedGameMode.value) {
            countryData.getRandomCountry().then(id => {
                country = id
                countryLoaded++;
            })
        } else {
            country = selectedGameMode.value
            countryLoaded++;
        }
    };

    const handleGameStart = () => {
        clickedStart = true;
        loadCountry()
    }

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

    const getWebCam = () => {
        if (!selectedGameMode.value) {
            staticGameMode = false
            fetchPath = '/list/country=' + country + '?show=webcams:location,image,player'
        } else if (selectedGameMode.mode === 'Country') {
            fetchPath = '/list/country=' + country + '/limit=40?show=webcams:location,image,player'
        } else if (selectedGameMode.mode === 'Continent') {
            fetchPath = '/list/continent=' + country + '/limit=40?show=webcams:location,image,player'
        }

        const allWebCams = new DataProvider(fetchPath);
        if (staticWebCamListLoaded && staticGameMode) {
            webcam = randomEntry(staticWebCamList)
            setWebCamImage(webcam)
        }
        if (!staticWebCamListLoaded || !staticGameMode) {
            allWebCams
                .fetchApiContent()
                .then((data) => {
                    staticWebCamList = data.result.webcams
                    webcam = randomEntry(staticWebCamList);
                    webcamLoaded = true;
                    staticWebCamListLoaded = true;
                    return webcam;
                })
                .then((webcam) => {
                    setWebCamImage(webcam)
                });
        }

    }

    const setWebCamImage = (webcam) => {
        const sizes = webcam.image.sizes.preview;
        webcamImage = {
            ...sizes,
            current: webcam.image.current.preview,
            daylight: webcam.image.daylight.preview
        };
    }

    gameMode.subscribe(value => {
        selectedGameMode = value;
    });

    $: if (countryLoaded === 1 && clickedStart) {
        countryLoaded++;
        getWebCam();
    }
</script>

<svelte:head>
    <title>WebcamGuessr</title>
    <meta name="description" content="Guess where the webcam is!"/>
</svelte:head>
{#if score}
    <ScoreScreen {selectedCoordinates} {actualCoordinates} {score} {webcam} on:resetGame={resetCountry}/>
{/if}
{#if !clickedStart}
    <section class="intro">
        <h1>Webcam-Guessr</h1>
        <SelectGameMode/>
        <Button on:click={handleGameStart} variant="raised">Start</Button>
    </section>
{/if}
{#if clickedStart && !score}
    <WebcamScreen
            on:modalShow={() =>{showModal=true}}
            on:resetGame={resetCountry}
            {countryLoaded}
            {webcamLoaded}
            {webcam}
            {webcamImage}
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
