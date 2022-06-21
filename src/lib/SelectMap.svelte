<script lang="ts">
    import {onMount} from 'svelte';
    import Map from "ol/Map.js";
    import View from "ol/View.js";
    import TileLayer from "ol/layer/Tile.js";
    import * as proj from "ol/proj.js";
    import OSM from "ol/source/OSM.js";
    import {createEventDispatcher} from 'svelte';

    import "ol/ol.css";

    const dispatch = createEventDispatcher();

    onMount(() => {
        const map = new Map({
            layers: [
                new TileLayer({
                    source: new OSM(),
                    visible: true,
                }),
            ],
            target: "map",
            view: new View({
                projection: "EPSG:900913", // OSM projection
                center: proj.transform([10.454124, 51.351489], "EPSG:4326", "EPSG:900913"),
                minZoom: 0,
                maxZoom: 10,
                zoom: 0,
            }),
        })
        map.on("click", (e) => {
            const coordinate = proj.toLonLat(e.coordinate).map((val) => {
                return val.toFixed(6);
            });
            const lon = coordinate[0];
            const lat = coordinate[1];
            dispatch('setCoordinates', {
                lat, lon
            })
        })

    })
    let m = {x: 0, y: 0};
    let markerVisible = false
    let markerLocked = false

    function handleMousemove(event) {
        if (!markerLocked) {
            const bounding = event.target.getBoundingClientRect()
            m.x = event.clientX - bounding.left;
            m.y = event.clientY - bounding.top;
        }
    }


</script>
<div class="map-wrapper">
    <div id="map" class:locked={markerLocked} on:mousemove={handleMousemove} on:mouseenter={() => {markerVisible=true}}
         on:mouseleave={() => {markerVisible = false}} on:click={()=>{markerLocked=true}}></div>
    <div id="marker" class:visible={markerVisible} class:locked={markerLocked} style="top:{m.y}px;left:{m.x}px"></div>
    {m.y}
</div>

<style lang="scss">
  .map-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
  }

  #map {
    cursor: none;
    width: calc(80vw - 6em);
    height: 800px;

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


  }
</style>