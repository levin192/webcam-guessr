<script lang="ts">
    import {gameState, maxRounds} from "../store";

    let storeGameState
    let maxRoundsStore

    gameState.subscribe(value => {
        storeGameState = value;
    });
    maxRounds.subscribe(value => {
        maxRoundsStore = value
    })
</script>
<div>
    <span>Round: {storeGameState.currentRound}/{maxRoundsStore}</span>
    <span>Score: {storeGameState.totalScore}</span>
</div>

<style lang="scss">
  div {
    margin-top: 1rem;
    margin-bottom: -1rem;
    span:not(:first-child) {
      padding-left: 7px;
      border-left: 1px solid var(--primary-color);
    }
  }
</style>