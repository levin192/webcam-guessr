<script lang="ts">
    import {env} from '$lib/env'
    import {onMount, createEventDispatcher} from 'svelte';
    import Fab, {Icon} from '@smui/fab'
    import Map from "ol/Map.js";
    import View from "ol/View.js";
    import TileLayer from "ol/layer/Tile.js";
    import * as proj from "ol/proj.js";
    import * as extent from "ol/extent.js";
    import BingMaps from 'ol/source/BingMaps.js';
    import {userPrefDarkMode, gameMode} from "$lib/store";

    import CountriesDataProvider from "$lib/util/CountriesDataProvider";

    const dispatch = createEventDispatcher();

    export let isFinal

    let lightMapStyle;
    let gameModeStore;
    let isCountryMode = false
    let dynamicExtent: unknown = {sw: [33, 0], ne: [33, 0]}
    let map


    userPrefDarkMode.subscribe(value => {
        lightMapStyle = value;
    });

    gameMode.subscribe(value => {
        gameModeStore = value;
    });

    if (gameModeStore.mode === 'Country') {
        isCountryMode = true
    }

    if (isCountryMode) {
        const countryInfo = new CountriesDataProvider(gameModeStore.value)
        countryInfo.getCountryExtent().then(r => {
            dynamicExtent = r
            const view = map.getView()
            let boundingExtent = extent.boundingExtent([dynamicExtent.sw.reverse(), dynamicExtent.ne.reverse()]);
            boundingExtent = proj.transformExtent(boundingExtent,proj.get('EPSG:4326'), proj.get('EPSG:3857'));
            view.fit(boundingExtent,null);
        })
    }
    const calcCenter = (a: number, b: number) => {
        return (a + b) / 2
    }



    onMount(() => {
        map = new Map({
            layers: [
                new TileLayer({
                    source: new BingMaps({
                        key: env.VITE_BING_API_KEY,
                        imagerySet: (!lightMapStyle) ? 'RoadOnDemand' : 'CanvasDark',
                        // use maxZoom 19 to see stretched tiles instead of the BingMaps
                        // "no photos at this zoom level" tiles
                        // maxZoom: 19
                    }),
                    visible: true,
                }),
            ],
            target: "map",
            view: new View({
                projection: "EPSG:3857",
                minZoom: 1,
                maxZoom: 10,
                zoom: 0,
                center: proj.transform([calcCenter(dynamicExtent.sw[1], dynamicExtent.ne[1]), calcCenter(dynamicExtent.sw[0], dynamicExtent.ne[0])], "EPSG:4326", "EPSG:3857"),
            }),
        })
        map.on('click', (e) => {
            const coordinate = proj.toLonLat(e.coordinate).map((val) => {
                return val.toFixed(6);
            });
            lon = coordinate[0];
            lat = coordinate[1];
        })
            })
    let lon
    let lat
    let m = {x: 0, y: 0}
    let mOld = {x: 0, y: 0}
    let markerVisible = false
    let markerLocked = false

    const confirmCoordinates = () => {
        dispatch('setCoordinates', {
            lat, lon
        })
        if (isFinal)
            dispatch('finalCoordsSet')
    }

    const handleMouseUp = (event) => {
        const targetClassList = event.target.classList
        let preventLock = false
        if (targetClassList.contains('ol-attribution-expand') || targetClassList.contains('ol-attribution-collapse')) {
            preventLock = true
        }
        const posX = event.clientX
        const posY = event.clientY
        if ((moved(posY, mOld.y) || moved(posX, mOld.x)) && !preventLock) {
            markerLocked = true
            const bounding = event.target.getBoundingClientRect()
            m.x = posX - bounding.left - 6;
            m.y = posY - bounding.top - 5;
        }
    }

    const handleMouseDown = (event) => {
        mOld.y = event.clientY
        mOld.x = event.clientX
    }

    const moved = (actual: number, comparison: number) => {
        return Math.abs(actual - comparison) === 0
    }
</script>

<div class="map-wrapper">
    <div id="map" class:locked={markerLocked} on:mousedown={handleMouseDown} on:mouseup={handleMouseUp}></div>
    <div id="marker" class:visible={markerVisible} class:locked={markerLocked} style="top:{m.y}px;left:{m.x}px">
        <div class="actions-buttons-wrap">
            <div class="submit">Submit?</div>
            <Fab exited="{!markerLocked}" color="primary" on:click={()=>{confirmCoordinates()}}>
                <Icon class="material-icons">done</Icon>
            </Fab>
            <Fab exited="{!markerLocked}" on:click={()=>{markerLocked=false}}>
                <Icon class="material-icons">close</Icon>
            </Fab>
        </div>
    </div>
</div>

<style lang="scss">
  .map-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
  }

  #map {
    cursor: crosshair;
    width: calc(100vw - 4rem);
    height: 50vh;
    @media (min-width: 900px) {
      height: 77vh;
      width: calc(80vw - 4em - 4rem);
    }

    &.locked {
      cursor: progress;
    }
  }

  #marker {
    width: 10px;
    height: 10px;
    border-radius: 100%;
    background-color: deeppink;
    border: solid 2px white;
    position: absolute;
    opacity: 0;
    bottom: auto;
    right: auto;

    &.visible, &.locked {
      opacity: 1;
    }

    &.locked {
      .actions-buttons-wrap {
        pointer-events: all;
        opacity: 1;
      }
    }

    .actions-buttons-wrap {
      display: flex;
      min-width: 140px;
      position: absolute;
      left: -75px;
      top: 25px;
      background: transparentize(white, .2);
      padding: 10px;
      border-radius: 5px;
      justify-content: space-evenly;
      opacity: 0;
      pointer-events: none;
      flex-wrap: wrap;

      .submit {
        width: 100%;
        margin-bottom: 5px;
        text-align: center;
        color: var(--invert-text);
      }
    }
  }

</style>