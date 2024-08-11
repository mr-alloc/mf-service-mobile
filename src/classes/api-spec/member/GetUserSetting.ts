import { call } from '@/utils/NetworkUtil'
import Member from '@/constant/api-meta/Member'

export class ResponseBody {

    private readonly _mainFamily: number

    constructor(mainFamily: number) {
        this._mainFamily = mainFamily
    }

    get mainFamily() {
        return this._mainFamily
    }

    static fromJson(json: any) {
        return new ResponseBody(json.mainFamily)
    }
}

