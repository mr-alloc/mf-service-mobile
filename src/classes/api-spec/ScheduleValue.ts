import ScheduleMode from "@/constant/ScheduleMode";
import TemporalUtil from "@/utils/TemporalUtil";
import RepeatOption from "@/constant/RepeatOption";
import CalendarDate from "@/classes/CalendarDate";
import Period from "@/classes/Period";

export default class ScheduleValue {
    private readonly _id: number;
    private readonly _categoryId: number
    private readonly _mode: ScheduleMode;
    private readonly _startAt: number;
    private readonly _scheduleTime: number;
    private readonly _endAt: number;
    private readonly _repeatOption: number;
    private readonly _repeatValues: Array<number>;

    constructor(id: number, categoryId: number, mode: number, startAt: number, scheduleTime: number, endAt: number, repeatOption: number, repeatValues: Array<number>) {
        this._id = id;
        this._categoryId = categoryId
        this._mode = ScheduleMode.fromValue(mode)!;
        this._startAt = startAt;
        this._scheduleTime = scheduleTime;
        this._endAt = endAt;
        this._repeatOption = repeatOption;
        this._repeatValues = repeatValues;
    }

    get id(): number {
        return this._id;
    }

    get categoryId(): number {
        return this._categoryId
    }

    get mode(): ScheduleMode {
        return this._mode;
    }

    get startAt(): number {
        return this._startAt;
    }

    get scheduleTime(): number {
        return this._scheduleTime;
    }

    get endAt(): number {
        return this._endAt;
    }

    get repeatOption(): number {
        return this._repeatOption;
    }

    get repeatValues(): Array<number> {
        return this._repeatValues;
    }

    static fromJson(json: any): ScheduleValue {
        return new ScheduleValue(
            json.id,
            json.categoryId,
            json.mode,
            json.startAt,
            json.scheduleTime,
            json.endAt,
            json.repeatOption,
            json.repeatValues
        );
    }

    consist(calendarStartAt: number, calendarEndAt: number): Array<Period> {
        switch (this._mode) {
            case ScheduleMode.SINGLE:
            case ScheduleMode.MULTIPLE:
                return [Period.of(this._startAt, this._endAt)];
            case ScheduleMode.PERIOD:
                return [Period.of(this._startAt, this._endAt)];
            case ScheduleMode.REPEAT: {
                const repeatOption = RepeatOption.fromValue(this._repeatOption)
                const repeatDay = new CalendarDate(this._repeatValues[0]);
                const days = TemporalUtil.getDiffDays(calendarStartAt, calendarEndAt);
                return TemporalUtil.getLocalDaysArray(calendarStartAt, days)
                    .filter(date => {
                        switch (repeatOption) {
                            case RepeatOption.WEEK:
                                return this._repeatValues.includes(date.dayOfWeek.value)
                            case RepeatOption.MONTH:
                                return date.date === repeatDay.date
                            case RepeatOption.YEAR:
                                return date.month === repeatDay.month && date.date === repeatDay.date
                            default:
                                throw new Error(`Invalid repeat option: ${repeatOption}`)
                        }
                    })
                    //반복은 시작일을 기준으로 표시 되어야하기 때문에, 현재 설정된 시작시간보다 이전 일자는 허용하지 않는다.
                    .filter(date => this._startAt <= date.timestamp && (date.timestamp <= this._endAt || this._endAt === 0))
                    .map(date => Period.of(date.timestamp, date.timestamp + (TemporalUtil.SECONDS_IN_DAY - 1)))
            }
            default:
                throw new Error(`Invalid schedule mode: ${JSON.stringify(this._mode)}`);
        }
    }
}
