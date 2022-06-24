import DataProvider from '../DataProvider';
import {randomEntry, fetchApiContent} from '../helpers';

const categoryData = new DataProvider('/list?show=categories');



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
