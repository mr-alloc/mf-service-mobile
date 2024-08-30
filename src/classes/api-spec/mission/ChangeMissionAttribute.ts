import MissionDetail from "@/classes/MissionDetail";

export class RequestBody {

    private readonly _missionId: number;
    private _stateId: number | null = null
    private _startStamp: number | null = null
    private _type: number | null = null
    private _title: string | null = null
    private _assignee: number | null = null
    private _status: number | null = null
    private _description: string | null = null
    private _deadline: number | null = null
    private _categoryId: number | null = null


    private constructor(missionId: number) {
        this._missionId = missionId;
    }

    static forAssignee(missionId: number, assignee: number): RequestBody {
        const requestBody = new RequestBody(missionId)
        requestBody._assignee = assignee
        return requestBody
    }

    static forTitle(missionId: number, title: string): RequestBody {
        const requestBody = new RequestBody(missionId)
        requestBody._title = title
        return requestBody
    }

    static forStatus(stateId: number | null, missionId: number, status: number, startStamp: number) {
        const requestBody = new RequestBody(missionId)
        requestBody._status = status
        requestBody._startStamp = startStamp
        requestBody._stateId = stateId
        return requestBody
    }

    static forName(missionId: number, title: string) {
        const requestBody = new RequestBody(missionId)
        requestBody._title = title
        return requestBody
    }

    static forType(missionId: number, type: number) {
        const requestBody = new RequestBody(missionId)
        requestBody._type = type
        return requestBody
    }

    static forCategory(missionId: number, categoryId: number) {
        const requestBody = new RequestBody(missionId)
        requestBody._categoryId = categoryId
        return requestBody
    }

    static forDeadline(missionId: number, deadline: number) {
        const requestBody = new RequestBody(missionId)
        requestBody._deadline = deadline
        return requestBody
    }

    static forDescription(missionId: number, description: string) {
        const requestBody = new RequestBody(missionId)
        requestBody._description = description
        return requestBody
    }

    toJSON() {
        const json = {
            missionId: this._missionId,
        } as {
            missionId: number,
            stateId?: number,
            startStamp?: number,
            type?: number,
            title?: string,
            assignee?: number,
            status?: number,
            description?: string,
            deadline?: number,
            categoryId?: number
        }

        this._stateId && (json.stateId = this._stateId)
        this._startStamp && (json.startStamp = this._startStamp)
        this._type && (json.type = this._type)
        this._title && (json.title = this._title)
        this._assignee && (json.assignee = this._assignee)
        this._status && (json.status = this._status)
        this._description && (json.description = this._description)
        this._deadline && (json.deadline = this._deadline)
        this._categoryId && (json.categoryId = this._categoryId)
        return json
    }
}

export class ResponseBody {

    private readonly _changed: MissionDetail;

    constructor(changed: MissionDetail) {
        this._changed = changed;
    }

    get changed(): MissionDetail {
        return this._changed;
    }

    static fromJson(json: any): ResponseBody {
        return new ResponseBody(MissionDetail.fromJson(json.changed));
    }
}
