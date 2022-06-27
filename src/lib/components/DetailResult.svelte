<script lang="ts">
    import Button from '@smui/button';
    import DataTable, {
        Head,
        Body,
        Row,
        Cell,
        Label,
        SortValue,
    } from '@smui/data-table';
    import IconButton from '@smui/icon-button';
    import Modal from '$lib/components/Modal.svelte';
    import {gameMode} from "$lib/store";

    export let gameState


    let showModal = false
    let gameModeStore

    let sort
    let items = gameState.results
    let sortDirection: Lowercase<keyof typeof SortValue> = 'ascending';


    const handleSort = () => {
        console.log(gameState)
        items.sort((a, b) => {
            const [aVal, bVal] = [a[sort], b[sort]][
                sortDirection === 'ascending' ? 'slice' : 'reverse'
                ]();
            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return aVal.localeCompare(bVal);
            }
            return Number(aVal) - Number(bVal);
        });
        items = items;
    }

    gameMode.subscribe(value => {
        gameModeStore = value
    })

</script>

<Button style="margin: 1rem 0" on:click={()=>{showModal=true}}>Show Detailed Result</Button>
{#if showModal}
    <Modal on:close={()=>{showModal=false}}>
        <h2 slot="header">Detailed Result</h2>
        <div class="scores">

            <DataTable
                    sortable
                    bind:sort
                    bind:sortDirection
                    on:SMUIDataTable:sorted={handleSort}
                    table$aria-label="User list"
                    style="margin-bottom: auto;"
            >
                <Head>
                    <Row>
                        <!--
                          Note: whatever you supply to "columnId" is
                          appended with "-status-label" and used as an ID
                          for the hidden label that describes the sort
                          status to screen readers.

                          You can localize those labels with the
                          "sortAscendingAriaLabel" and
                          "sortDescendingAriaLabel" props on the DataTable.
                        -->
                        <Cell numeric columnId="roundNumber">
                            <IconButton class="material-icons">arrow_upward</IconButton>
                            <Label>Round #</Label>
                        </Cell>
                        <Cell numeric columnId="scored">
                            <IconButton class="material-icons">arrow_upward</IconButton>
                            <Label>Scored</Label>
                            <!-- For non-numeric columns, icon comes second. -->

                        </Cell>
                        <Cell numeric columnId="distance">
                            <IconButton class="material-icons">arrow_upward</IconButton>
                            <Label>Distance</Label>
                        </Cell>
                        <!-- You can turn off sorting for a column. -->
                        <Cell sortable={false}>Country</Cell>
                        <Cell sortable={false}>Place</Cell>
                    </Row>
                </Head>
                <Body>
                {#each items as item (item.roundNumber)}
                    <Row>
                        <Cell numeric>{item.roundNumber}</Cell>
                        <Cell numeric>{item.scored}</Cell>
                        <Cell numeric>{item.distance}km</Cell>
                        <Cell><img src="{'https://countryflagsapi.com/svg/'+ item.country_code}" class="flag"
                                   alt=""/>{item.country}</Cell>
                        <Cell>

                            {#if item.wikipedia }
                                <a href="{item.wikipedia}" target="_blank">{item.city}</a>
                            {:else}
                                {item.city}
                            {/if}
                        </Cell>
                    </Row>
                {/each}
                </Body>
            </DataTable>
            <div>
                <b>Total Score: {gameState.totalScore}</b>
                <hr>
                <p>Mode: {gameModeStore.mode}
                    {#if gameModeStore.value}&nbsp;-&nbsp;{gameModeStore.value}{/if}
                </p>
                <p>Rounds: {gameState.currentRound}</p>
                <p>Resets: {gameState.resetCount}</p>
                <hr>
                <div class="images">
                    {#each items as item}
                        <div class="images-card"><img src="{item.thumb}" alt="" loading="lazy">
                            <small>Round {item.roundNumber} - {item.city}</small>
                        </div>
                    {/each}
                </div>
            </div>
        </div>

    </Modal>
{/if}

<style lang="scss">
  .scores {
    display: grid;
    grid-template-columns: max-content 2fr;
    gap: 30px 30px;
  }

  .flag {
    width: auto;
    height: auto;
    max-width: 1rem;
    max-height: 1rem;
    object-fit: contain;
    display: inline-block;
    margin-right: .5rem;
  }

  .images {
    display: flex;
    flex-wrap: wrap;
    margin-left: -5px;
    margin-right: -5px;
    &-card {
      margin: 5px;
    }
  }

</style>