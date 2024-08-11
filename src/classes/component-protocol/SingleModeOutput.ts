import type IDatePickerOutput from '@/classes/component-protocol/IDatePickerOuput'
import ScheduleMode from '@/constant/ScheduleMode'

export default class SingleModeOutput implements IDatePickerOutput {

    private readonly _scheduleMode = ScheduleMode.SINGLE
    private readonly _selectedTimestamps: Set<number>
    private _scheduleTime: number

    constructor(timestamp: number) {
        this._selectedTimestamps = new Set([timestamp])
        this._scheduleTime = 0
    }

    get selectedTimestamps(): Set<number> {
        return this._selectedTimestamps
    }

    get scheduleMode(): ScheduleMode {
        return this._scheduleMode
    }

    setScheduleTime(scheduleTime: number): void {
        this._scheduleTime = scheduleTime
    }


    toJSON() {
        return {
            scheduleMode: this._scheduleMode.value,
            scheduleTime: this._scheduleTime,
            selected: Array.from(this._selectedTimestamps)
        }
    }
}
