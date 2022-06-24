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
    import BingMaps from 'ol/source/BingMaps.js';

    import {env} from "$lib/env";
    import {userPrefDarkMode} from "$lib/store";

    export let coordsSolution: number[]
    export let coordsClicked: number[]

    let lightMapStyle;

    userPrefDarkMode.subscribe(value => {
        lightMapStyle = value;
    });

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
        // Longitude difference
        const dLng = toRadius(lng2 - lng1);

        // Convert to radians
        lat1 = toRadius(lat1);
        lat2 = toRadius(lat2);
        lng1 = toRadius(lng1);

        const bX = Math.cos(lat2) * Math.cos(dLng);
        const bY = Math.cos(lat2) * Math.sin(dLng);
        const lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + bX) * (Math.cos(lat1) + bX) + bY * bY));
        const lng3 = lng1 + Math.atan2(bY, Math.cos(lat1) + bX);

        // Return result
        return [toDegree(lng3), toDegree(lat3)];
    }

    onMount(() => {
        const map = new Map({
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
                    color: 'rgb(244, 67, 54)',
                    width: 2
                })
            })
        ];
        const markerStyleCircle = new style.Style({
            image: new style.Circle({
                radius: 4,
                fill: new style.Fill({color: 'rgba(244, 67, 54)'}),
                stroke: new style.Stroke({
                    color: 'rgb(244, 67, 54', width: 1
                })
            })
        })

        const line = new layer.Vector({
            source: new source.Vector({
                features: [new Feature({
                    geometry: new geom.LineString([pointsSolution, pointsClicked]),
                    name: 'Line',
                })]
            })
        });
        const webcamMarker = new layer.Vector({
            source: new source.Vector({
                features: [
                    new Feature({
                        geometry: new geom.Point(proj.fromLonLat(coordsSolution)),
                        name: 'Webcam Position'
                    })
                ]
            })
        });
        const clickedMarker = new layer.Vector({
            source: new source.Vector({
                features: [
                    new Feature({
                        geometry: new geom.Point(proj.fromLonLat(coordsClicked)),
                        name: 'Clicked Position'
                    })
                ]
            })
        });
        const markerStyleX = new style.Style({
            image: new style.RegularShape({
                fill: new style.Fill({color: 'rgb(244, 67, 54)'}),
                stroke: new style.Stroke({
                    color: 'rgb(244, 67, 54', width: 3
                }),
                points: 4,
                radius: 10,
                radius2: 0,
                rotation: Math.PI / 4,
                angle: 0,
            }),
        })


        line.setStyle(lineStyle);
        map.addLayer(line);

        webcamMarker.setStyle(markerStyleX);
        map.addLayer(webcamMarker);

        clickedMarker.setStyle(markerStyleCircle);
        map.addLayer(clickedMarker);

        const extent = line.getSource().getExtent();

        map.getView().fit(extent, {padding: [35, 35, 35, 35]});


    })
</script>
<div id="solvedMap"></div>

<style lang="scss">

  #solvedMap {
    width: calc(80vw - 4em);
    height: 50vh;
  }


</style>