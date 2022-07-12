<script lang="ts">
    import Button, {Icon, Label} from '@smui/button'
    import TeleportDataProvider from "$lib/util/TeleportDataProvider";

    export let webcam

    const location = {
        lat: webcam.location.latitude,
        lon: webcam.location.longitude,
        countryCode: webcam.location.country_code,
        region: webcam.location.region
    }

    let allSalaryHints
    let singleHint
    let photos

    const allTele = new TeleportDataProvider(`/locations/${location.lat}%2C${location.lon}/`)

    const salaries = new TeleportDataProvider(`/countries/iso_alpha2%3A${location.countryCode}/salaries/`)
    const fetchHintContents = () => {
        console.log('okaycalled')
        allTele.fetchApiContent().then(r => {
            const urbanArea = r['_embedded']["location:nearest-urban-areas"]
            if (urbanArea.length > 0) {
                let urbanAreaString = urbanArea[0]['_links']['location:nearest-urban-area'].href.replace('https://api.teleport.org/api', '')
                new TeleportDataProvider(urbanAreaString + 'images/').fetchApiContent().then(
                    r => {
                        photos = r.photos
                    }
                )
            } else {
                getAllSalaries()
            }
        })


    }

    const getAllSalaries = () => {
        salaries.fetchApiContent().then(r => {
            allSalaryHints = r.salaries.map(x => {
                return {
                    id: x.job.id,
                    name: x.job.title,
                    salary: Math.ceil((x.salary_percentiles.percentile_75) / 12)
                }
            })
        })
    }

    $: if (allSalaryHints) {
        singleHint = allSalaryHints[random(0, allSalaryHints.length)]
        singleHint = `You earn about ${singleHint.salary}$ per month as ${(isVocal(singleHint.name[0]))?'an':'a'} ${singleHint.name} in this Country.`
    }

    const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
    const isVocal = (s: string) => {
        const vocals = ['a', 'e', 'i', 'o', 'u']
        return vocals.includes(s.toLowerCase())
    }
</script>

<pre>{location.lat}</pre>
<pre>{location.lon}</pre>
<pre>{location.countryCode}</pre>
<pre>{location.region}</pre>

<Button on:click={fetchHintContents}>
    <Icon class="material-icons">tips_and_updates</Icon>
    <Label>Show me a hint</Label>
</Button>

{#if allSalaryHints}
    {singleHint}

{/if}

{#if (photos)}
    {#each photos as photo}
        <img src="{photo.image.web}" alt="">
        Photographer: {photo.attribution.photographer} <br>
        Site: {photo.attribution.site} <br>
        License: {photo.attribution.license}
    {/each}
{/if}
