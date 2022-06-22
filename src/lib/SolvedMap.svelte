<script lang="ts">
    import {onMount} from 'svelte';
    import Map from "ol/Map.js";
    import View from "ol/View.js";
    import TileLayer from "ol/layer/Tile.js";
    import * as proj from "ol/proj.js";
    import * as geom from "ol/geom.js";
    import * as source from "ol/source.js";
    import * as layer from "ol/layer.js";
    import * as style from "ol/style.js";
    import Feature from "ol/Feature.js";
    import OSM from "ol/source/OSM.js";
    import "ol/ol.css";

    export let coordsSolution: number[]
    export let coordsClicked: number[]

    const toRadius = (number: number) => {
        return number * Math.PI / 180;
    }
    const toDegree = (number: number) => {
        return number * (180 / Math.PI);
    }

    const middlePoint = (coordinates1: number[], coordinates2: number[]) => {
        let lng1 = coordinates1[0]
        let lng2 = coordinates2[0]
        let lat1 = coordinates1[1]
        let lat2 = coordinates2[1]
        //-- Longitude difference
        const dLng = toRadius(lng2 - lng1);

        //-- Convert to radians
        lat1 = toRadius(lat1);
        lat2 = toRadius(lat2);
        lng1 = toRadius(lng1);

        const bX = Math.cos(lat2) * Math.cos(dLng);
        const bY = Math.cos(lat2) * Math.sin(dLng);
        const lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + bX) * (Math.cos(lat1) + bX) + bY * bY));
        const lng3 = lng1 + Math.atan2(bY, Math.cos(lat1) + bX);

        //-- Return result
        return [toDegree(lng3), toDegree(lat3)];
    }

    onMount(() => {
        const map = new Map({
            layers: [
                new TileLayer({
                    source: new OSM(),
                    visible: true,
                }),
            ],
            target: "solvedMap",
            view: new View({
                projection: "EPSG:900913", // OSM projection
                center: proj.transform(middlePoint(coordsSolution, coordsClicked), "EPSG:4326", "EPSG:900913"),
                minZoom: 0,
                maxZoom: 10,
                zoom: 0,
            }),
        })

        const pointsSolution = proj.fromLonLat(coordsSolution);
        const pointsClicked = proj.fromLonLat(coordsClicked);

        const lineStyle = [
            // linestring
            new style.Style({
                stroke: new style.Stroke({
                    color: '#d12710',
                    width: 4
                })
            })
        ];

        const line = new layer.Vector({
            source: new source.Vector({
                features: [new Feature({
                    geometry: new geom.LineString([pointsSolution, pointsClicked]),
                    name: 'Line',
                })]
            })
        });

        line.setStyle(lineStyle);
        map.addLayer(line);
        const extent = line.getSource().getExtent();

        map.getView().fit(extent, {padding: [25, 25, 25, 25]});
    })
</script>
<div id="solvedMap"></div>

<style lang="scss">

  #solvedMap {
    width: calc(80vw - 4em);
    height: 50vh;
  }


</style>