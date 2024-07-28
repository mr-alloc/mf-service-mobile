export default class ResponseBody {

    private readonly _id: number;
    private readonly _inviteCode: string;
    private readonly _name: string;

    constructor(id: number, inviteCode: string, name: string) {
        this._id = id;
        this._inviteCode = inviteCode;
        this._name = name;
    }

    get id(): number {
        return this._id;
    }

    get inviteCode(): string {
        return this._inviteCode;
    }

    get name(): string {
        return this._name;
    }

    static fromJson(json: any): ResponseBody {
        return new ResponseBody(json.id, json.inviteCode, json.name);
    }
}
