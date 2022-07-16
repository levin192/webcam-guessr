<script lang="ts">
    import Button, {Icon, Label} from '@smui/button'
    import TeleportDataProvider from "$lib/util/TeleportDataProvider";
    import Modal from '$lib/components/Modal.svelte';

    export let webcam

    let location = {
        lat: webcam.location.latitude,
        lon: webcam.location.longitude,
        countryCode: webcam.location.country_code,
        region: webcam.location.region
    }

    let allSalaryHints
    let singleHint
    let photos
    let population
    let showModal = false
    let flagReveal = false

    const locationInfo = new TeleportDataProvider(`/locations/${location.lat}%2C${location.lon}/`)

    const salaries = new TeleportDataProvider(`/countries/iso_alpha2%3A${location.countryCode}/salaries/`)
    const populationData = new TeleportDataProvider(`/countries/iso_alpha2%3A${location.countryCode}/`)

    const fetchHintContents = () => {
        populationData.fetchApiContent().then(r => {
            population = r.population
        })
        salaries.fetchApiContent().then(r => {
            allSalaryHints = r.salaries.map(x => {
                return {
                    id: x.job.id,
                    name: x.job.title,
                    salary: Math.ceil((x.salary_percentiles.percentile_75) / 12)
                }
            })
        })
        locationInfo.fetchApiContent().then(r => {
            const urbanArea = r['_embedded']["location:nearest-urban-areas"]
            if (urbanArea.length > 0) {
                let urbanAreaString = urbanArea[0]['_links']['location:nearest-urban-area'].href.replace('https://api.teleport.org/api', '')
                new TeleportDataProvider(urbanAreaString + 'images/').fetchApiContent().then(
                    r => {
                        photos = r.photos
                    }
                )
            }
        })

        showModal = true
    }


    $: if (allSalaryHints) {
        singleHint = allSalaryHints[random(0, allSalaryHints.length)]
        singleHint = `You earn about ${singleHint.salary}$ per month as ${(isVocal(singleHint.name[0])) ? 'an' : 'a'} ${singleHint.name} in this Country.`
    }

    const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
    const isVocal = (s: string) => {
        const vocals = ['a', 'e', 'i', 'o', 'u']
        return vocals.includes(s.toLowerCase())
    }
</script>

<Button on:click={fetchHintContents}>
    <Icon class="material-icons">tips_and_updates</Icon>
    <Label>Show me a hint</Label>
</Button>

{#if showModal }
    <Modal on:close={() => (showModal = false)} cssClass="modal-map">
        <h2 slot="header">Your hint</h2>
        {#if (photos)}
            {#each photos as photo}
                <p style="margin-bottom: 5px;">A Picture from the region where the webcam is located:</p>
                <div class="photo-wrapper">
                    <small>
                        Photographer: {photo.attribution.photographer} |
                        Site: {photo.attribution.site} |
                        License: {photo.attribution.license}
                    </small>
                    <img src="{photo.image.web}" alt="" style="width:100%;height: auto">
                </div>
                <hr>
            {/each}
        {/if}
        <p>Some Facts:</p>
        <div class="facts">
            <ul>
                {#if population}
                    <li>There live about {population.toLocaleString()} people in this country.</li>
                {/if}

                {#if allSalaryHints}
                    <li>{singleHint}</li>
                {/if}
            </ul>
            {#if !flagReveal}
                <Button on:click={()=>{flagReveal = true}}>Reveal Flag (-500 Score)</Button>
            {:else}
                <img src="{'https://countryflagsapi.com/svg/'+ webcam.location.country_code}" style="width: 100%"
                     alt="" class="mdc-elevation--z8"/>
            {/if}
        </div>
    </Modal>
{/if}

<style lang="scss">
  .photo-wrapper {
    position: relative;
    margin-bottom: 15px;

    small {
      right: 0;
      bottom: 0;
      padding: 1px 4px;
      background-color: transparentize(white, .5);
      position: absolute;
      text-align: right;
      display: block;
    }
  }
.facts {
  display: grid;
  grid-auto-columns: 1fr;
  grid-template-columns: 5fr 1fr;
  gap: 0 15px;
  margin-bottom: 15px;
}
</style>