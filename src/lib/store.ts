import { writable } from 'svelte/store';

export const userPrefDarkMode = writable(false);
export const gameMode = writable({
    mode: 'World',
    value: null
})