<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import Button from '@smui/button';
	import DataProvider from '$lib/util/DataProvider';
	import { randomEntry, getDistanceInKm } from '$lib/util/helpers';
	import SelectMap from '$lib/maps/SelectMap.svelte';
	import CountryData from '$lib/util/data/CountryData';
	import Modal from '$lib/components/Modal.svelte';
	import SelectGameMode from '$lib/components/SelectGameMode.svelte';
	import ScoreScreen from '$lib/components/ScoreScreen.svelte';
	import WebcamScreen from '$lib/components/WebcamScreen.svelte';
	import { onMount } from 'svelte';

	let country: unknown;
	let countryLoaded = 0;
	let webcam: string | PromiseLike<string>;
	let webcamLoaded: boolean = false;
	let showModal: boolean = false;
	let selectedCoordinates;
	let actualCoordinates;
	let score: number;
	let webCamImage: any;
	let clickedStart: boolean = false;

	const countryData = new CountryData();

	onMount(() => {
		loadCountry();
	});

	$: if (countryLoaded === 1 && clickedStart) {
		countryLoaded++;
		const webcamList = new DataProvider(
			'/list/country=' + country + '?show=webcams:location,image,player'
		);

		webcamList
			.fetchApiContent()
			.then((data) => {
				webcam = randomEntry(data.result.webcams);
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

	const loadCountry = () => {
		countryData.getRandomCountry().then((id) => {
			country = id;
			countryLoaded++;
		});
	};

	const handleGameStart = () => {
		clickedStart = true;
	};

	const handleSetCoordinates = (event) => {
		selectedCoordinates = event.detail;
		selectedCoordinates = {
			lon: parseFloat(selectedCoordinates.lon),
			lat: parseFloat(selectedCoordinates.lat)
		};
		actualCoordinates = { lon: webcam.location.longitude, lat: webcam.location.latitude };
		showModal = false;
		score = getDistanceInKm(selectedCoordinates, actualCoordinates);
	};
</script>

<svelte:head>
	<title>WebcamGuessr</title>
	<meta name="description" content="Guess where the webcam is!" />
</svelte:head>
{#if score}
	<ScoreScreen {selectedCoordinates} {actualCoordinates} {score} {webcam} />
{/if}
{#if !clickedStart}
	<section class="intro">
		<h1>Webcam-Guessr</h1>
		<SelectGameMode />
		<Button on:click={handleGameStart} variant="raised">Start</Button>
	</section>
{/if}
{#if clickedStart && !score}
	<WebcamScreen
		on:modalShow={() => {
			showModal = true;
		}}
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
			<SelectMap on:setCoordinates={handleSetCoordinates} />
		</Modal>
	</section>
{/if}
