import WindyDataProvider from '../WindyDataProvider';
import {randomEntry, fetchApiContent} from '../helpers';

const categoryData = new WindyDataProvider('/list?show=categories');



export default class CategoryData {
    currentCategoryData: string[];

    constructor() {
        this.currentCategoryData = []
    }

    public async getRandomCategory() {
        this.currentCategoryData = await fetchApiContent(categoryData, 'categories')
        return randomEntry(this.currentCategoryData)
    }
}
