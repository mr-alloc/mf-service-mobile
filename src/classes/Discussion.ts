export default class Discussion {

    private readonly _id: number
    private readonly _missionId: number
    private readonly _name: string
    private readonly _latestMessage: string
    private readonly _latestUpdateTime: number
    private readonly _stateScheduleTime: number

    private constructor(id: number, missionId: number, name: string, latestMessage: string, latestUpdateTime: number, stateScheduleTime: number) {
        this._id = id
        this._name = name
        this._missionId = missionId
        this._latestMessage = latestMessage
        this._latestUpdateTime = latestUpdateTime
        this._stateScheduleTime = stateScheduleTime
    }

    get id(): number {
        return this._id
    }

    get missionId(): number {
        return this._missionId
    }

    get name(): string {
        return this._name
    }

    get latestMessage(): string {
        return this._latestMessage
    }

    get latestUpdateTime(): number {
        return this._latestUpdateTime
    }

    get stateScheduleTime(): number {
        return this._stateScheduleTime
    }

    public static fromJson(json: any): Discussion {
        return new Discussion(json.id, json.missionId, json.name, json.latestMessage, json.latestUpdateTime, json.stateScheduleTime)
    }
}
