import { env } from '../env'

export default class CountriesDataProvider {
    public apiURL: string
    public apiModifier: string
    public apiContent: object | undefined
    public fetchUrl: string
    public country: string

    constructor(modifier: string) {
        this.country = modifier.toLowerCase()
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
        const apiResponse: any = await this.fetchApiContent()
        return {
            ...apiResponse[this.country].boundingBox
        }
    }
}