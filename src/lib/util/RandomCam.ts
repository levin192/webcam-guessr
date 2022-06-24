import DataProvider from '../DataProvider';
import { randomEntry } from '../helpers';

const countriesData = new DataProvider('/list?show=countries');
const categoryData = new DataProvider('/list?show=categories');

async function fetchApiContent(obj: any): Promise<string[]> {
	return obj.fetchApiContent().then((data: any) => {
		return data.result.countries;
	});
}

export default class RandomCam {
	currentCountryData: string[];

	constructor() {
		this.currentCountryData = [];
	}

	public async getRandomCountry() {
		// only fetching new country every 20th request to save resources
		const randomNumberZeroToTwenty = Math.floor(Math.random() * 21);

		if (randomNumberZeroToTwenty === 20 || this.currentCountryData.length === 0) {
			// fresh fetch and save
			const results = await fetchApiContent(countriesData);

			this.currentCountryData = results;

			return randomEntry(this.currentCountryData);
		}

		// use old fetched data 19 out of 20 times
		return randomEntry(this.currentCountryData);
	}

	public async getRandomCategory() {
		return await fetchApiContent(categoryData).then((data: any) => {
			return data.result.countries;
		});
	}
}

//export {randomCountry}
