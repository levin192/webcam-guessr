<script lang="ts">
    import {gameState} from "../store";

    let storeGameState

    gameState.subscribe(value => {
        storeGameState = value;
    });
</script>

{JSON.stringify(storeGameState)}