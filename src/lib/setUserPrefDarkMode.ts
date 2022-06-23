import {userPrefDarkMode} from "./store";

const isDarkMode = () => {
    return (window.matchMedia('(prefers-color-scheme: dark)').matches)
}

export const setUserPrefDarkMode = () => {
    console.log((isDarkMode()) ? '🌑 Dark from initial' : '☀️ Light from initial')
    userPrefDarkMode.set(isDarkMode())
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        console.log((isDarkMode()) ? '🌑 Dark from event' : '☀️ Light from event')
        userPrefDarkMode.set(isDarkMode())
    });
}