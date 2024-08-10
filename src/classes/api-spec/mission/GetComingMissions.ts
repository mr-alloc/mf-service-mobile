import MissionDetail from '@/classes/MissionDetail'

export class ResponseBody {

    private readonly _missions: Array<MissionDetail>

    constructor(missions: Array<MissionDetail>) {
        this._missions = missions
    }

    get missions() {
        return this._missions
    }

    static fromJson(json: any) {
        return new ResponseBody(json.missions.map(MissionDetail.fromJson))
    }

}
