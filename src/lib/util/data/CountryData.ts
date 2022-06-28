import WindyDataProvider from '../WindyDataProvider';
import {randomEntry, fetchApiContent} from '../helpers';


export default class CountryData {
    public allCountries: unknown;

    public getRandomCountry() {
        return new Promise((resolve) => {
            const localStorage = window.localStorage
            if (localStorage.getItem('countriesData')) {
                console.info('🌏 country data in localStorage')
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                let parsedData = JSON.parse(localStorage.getItem('countriesData'))
                parsedData = parsedData.map((country: any) => country.id)
                resolve(randomEntry(parsedData));
            } else {
                this.setAllCountries().then(() => this.getRandomCountry())
            }
           })
    }

    public getAllCountries() {
        return new Promise((resolve) => {
            const localStorage = window.localStorage
            if (localStorage.getItem('countriesData')) {
                console.info('🌏 country data in localStorage')
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const parsedData = JSON.parse(localStorage.getItem('countriesData')) // TYPESCRIPT?!!?!?
                resolve(parsedData);
            } else {
                this.setAllCountries().then(() => this.getAllCountries())
            }
        })
    }

    public async setAllCountries() {
        const localStorage = window.localStorage
        if (!localStorage.getItem('countriesData')) {
            const countriesData = new WindyDataProvider('/list?show=countries');
            this.allCountries = await fetchApiContent(countriesData, 'countries');
            localStorage.setItem('countriesData', JSON.stringify(this.allCountries))
        } else {
            const randomNumberZeroToHundred = Math.floor(Math.random() * 101);
            if (randomNumberZeroToHundred === 1) {
                localStorage.removeItem('countriesData')
                await this.setAllCountries()
            } else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                this.allCountries = JSON.parse(localStorage.getItem('countriesData'))
            }
        }
    }

}

