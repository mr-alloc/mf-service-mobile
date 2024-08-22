export class RequestBody {

    private readonly _name: string
    private readonly _color: string
    private readonly _description: string

    constructor(name: string, color: string, description: string) {
        this._name = name
        this._color = color
        this._description = description
    }


    toJSON() {
        return {
            name: this._name,
            color: this._color,
            description: this._description
        }
    }
}
