import {env} from '../env'


export default class WindyDataProvider {
    private readonly apiKey: string
    public apiURL: string
    public apiModifier: string
    public apiContent: object | undefined
    public fetchUrl: string

    constructor(modifier: string) {
        this.apiKey = this.setApiKey()
        this.apiURL = 'https://api.windy.com/api/webcams/v2/'
        this.apiModifier = this.cleanModifier(modifier)
        this.fetchUrl = this.setFetchUrl()
    }

    private cleanModifier = (modifier: string) => {
        return (modifier[0] === '/') ? modifier.substring(1) : modifier
    }
    private setFetchUrl = () => {
        return this.apiURL + this.apiModifier
    }
    public fetchApiContent = () => {
        const requestHeaders: HeadersInit = new Headers();
        requestHeaders.set('x-windy-key', this.apiKey);

        return new Promise((resolve, reject) => {
            fetch(this.fetchUrl, {
                headers: requestHeaders
            }).then(response => {
                return response
            }).then(data => {
                this.apiContent = data.json()
                resolve(this.apiContent)
            }).catch((reason) => {
                    console.log('API Unreachable', reason)
                    reject('API Error')
                }
            )

        })
    }
    public setApiKey = () => {
        return (env.VITE_WINDY_API_KEY) ? env.VITE_WINDY_API_KEY : ''
    }
}