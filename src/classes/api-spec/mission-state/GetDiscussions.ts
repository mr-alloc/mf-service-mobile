import Discussion from '@/classes/Discussion'

export class ResponseBody {

    private readonly _discussions: Array<Discussion>

    private constructor(discussions: Array<Discussion>) {
        this._discussions = discussions
    }

    get discussions(): Array<Discussion> {
        return this._discussions
    }

    public static fromJson(json: any) {
        return new ResponseBody(
            json.discussions.map(Discussion.fromJson)
        )
    }
}
