import { writable } from 'svelte/store';

export const userPrefDarkMode = writable(false);
export const gameMode = writable({
    mode: 'World',
    value: null
})

export const gameState = writable({
    currentRound: 0,
    totalScore: 0,
    results: [],
    resetCount: 0
})

export const maxRounds = writable(10)