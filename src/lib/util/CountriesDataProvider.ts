import { env } from '../env'

export default class CountriesDataProvider {
    public apiURL: string
    public apiModifier: string
    public apiContent: object | undefined
    public fetchUrl: string

    constructor(modifier: string) {
        this.apiURL = '/data/json/countries/'
        this.apiModifier = this.setModifier(modifier)
        this.fetchUrl = this.setFetchUrl()
    }
    private setModifier = (modifier: string) => {
        return modifier[0].toLowerCase()
    }
    private setFetchUrl = () => {
        return this.apiURL + this.apiModifier + '.json'
    }
    public fetchApiContent = () => {
        return new Promise((resolve) => {
            fetch(this.fetchUrl).then(data => {
                this.apiContent = data.json()
                resolve(this.apiContent)
            })
        })
    }
    private getUserName = () => {
        return (env.VITE_GEONAMES_USER)?env.VITE_GEONAMES_USER:''
    }

    public async getCountryExtent() {
        console.log(this.apiModifier)
        const apiResponse: unknown = await this.fetchApiContent()
        let countryExtent = apiResponse
        console.log(apiResponse)
        // countryExtent = countryExtent.map(item => {
        //     return {
        //         w: item.west, s: item.south, e: item.east, n: item.north
        //     }
        // })
        // countryExtent = countryExtent[0]
        return countryExtent
    }
}