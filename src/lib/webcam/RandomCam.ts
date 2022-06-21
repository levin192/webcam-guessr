import DataProvider from "../DataProvider";
import {randomEntry} from "../helpers";

const countriesData = new DataProvider('/list?show=countries')
const categoryData = new DataProvider('/list?show=categories')




async function randomProps(obj: any) {
    const entry = obj.fetchApiContent().then((data: any) => {
            return randomEntry(data.result.countries)
        }
    )
    return await entry
}

export default class RandomCam {
    public getRandomCountry() {
        return new Promise((resolve) => {
            randomProps(countriesData).then(result => resolve(result))
        })
    }

    public getRandomCategory() {
        return new Promise((resolve) => {
            randomProps(categoryData).then(result => resolve(result))
        })
    }
}

//export {randomCountry}