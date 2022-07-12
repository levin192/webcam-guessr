
export default class TeleportDataProvider {
    public apiURL: string
    public apiModifier: string
    public apiContent: object | undefined
    public fetchUrl: string

    constructor(modifier: string) {
        this.apiURL = 'https://api.teleport.org/api/'
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
        requestHeaders.set('Accept', 'application/vnd.teleport.v1+json');

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
}