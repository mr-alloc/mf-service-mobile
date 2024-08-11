export class RequestBody {

    private readonly _familyId: number

    constructor(familyId: number) {
        this._familyId = familyId
    }

    get familyId() {
        return this._familyId
    }

    toJSON() {
        return {
            familyId: this._familyId
        }
    }
}

export class ResponseBody {

    private readonly _changedFamily: number

    private constructor(changedFamily: number) {
        this._changedFamily = changedFamily
    }

    get changedFamily() {
        return this._changedFamily
    }

    public static fromJson(json: any) {
        return new ResponseBody(json.changedFamily)
    }
}
