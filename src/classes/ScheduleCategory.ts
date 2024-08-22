export default class ScheduleCategory {

    private readonly _id: number
    private readonly _name: string
    private readonly _color: string
    private readonly _description: string
    private readonly _order: number

    private constructor(id: number, name: string, color: string, description: string, order: number) {
        this._id = id
        this._name = name
        this._color = color
        this._description = description
        this._order = order
    }

    get id() {
        return this._id
    }

    get name() {
        return this._name
    }

    get color() {
        return this._color
    }

    get description() {
        return this._description
    }

    get order() {
        return this._order
    }

    public static fromJson(json: any) {
        return new ScheduleCategory(json.categoryId, json.name, json.color, json.description, json.order)
    }
}
