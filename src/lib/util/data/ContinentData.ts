import WindyDataProvider from '../WindyDataProvider';

interface continent {
    id: string,
    name: string,
    count?: number
}


export default class ContinentData {
    public setData = () => {
        return new Promise((resolve) => {
            const localStorage = window.localStorage
            if (!localStorage.getItem('continentData')) {
                const continentData = new WindyDataProvider('/list?show=continents');
                continentData.fetchApiContent().then((data: any) => {
                    const result = data.result
                    const continentData = result.continents.filter((continent: continent) => continent.name !== 'Antarctica')
                    continentData.forEach((continent: continent) => delete continent.count)
                    localStorage.setItem('continentData', JSON.stringify(continentData))
                    resolve(data)
                })
            } else {
                console.info('🌏 Continent data in localStorage')
            }
            return
        })
    }
    public getData = () => {
        return new Promise((resolve) => {
            const continentData = window.localStorage.getItem('continentData')
            if (continentData) {
                const data = JSON.parse(continentData)
                resolve(data)
            } else {
                this.setData().then(() => this.getData().then(r => {
                    resolve(r)
                }))
            }
        })
    }
}

