import WindyDataProvider from '../WindyDataProvider';
import {randomEntry} from '../helpers';


export default class CountryData {

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
                this.setData().then(() => this.getRandomCountry().then(r => {
                    resolve(r)
                }))
            }
        })
    }

    public setData = () => {
        return new Promise((resolve) => {
            const localStorage = window.localStorage
            if (!localStorage.getItem('countriesData')) {
                const countryData = new WindyDataProvider('/list?show=countries');
                countryData.fetchApiContent().then((data: any) => {
                    localStorage.setItem('countriesData', JSON.stringify(data.result.countries))
                    resolve(data)
                })
            } else {
                console.info('🌏 country data in localStorage')
            }
            return
        })
    }

    public getData = () => {
        return new Promise((resolve) => {
            const countryData = window.localStorage.getItem('countriesData')
            if (countryData) {
                const data = JSON.parse(countryData)
                resolve(data)
            } else {
                this.setData().then(() => this.getData().then(r => {
                    resolve(r)
                }))
            }
        })
    }
}

