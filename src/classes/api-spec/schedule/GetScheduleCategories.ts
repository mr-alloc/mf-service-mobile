import ScheduleCategory from '@/classes/ScheduleCategory'

export class ResponseBody {

    private readonly _categories: Array<ScheduleCategory>

    private constructor(categories: Array<ScheduleCategory>) {
        this._categories = categories
    }

    get categories() {
        return this._categories
    }

    public static fromJson(json: any) {
        return new ResponseBody(json.categories.map(ScheduleCategory.fromJson))
    }
}
