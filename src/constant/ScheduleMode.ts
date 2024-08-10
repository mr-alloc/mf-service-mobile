import SelectOption from "@/classes/SelectOption";
import CollectionUtil from "@/utils/CollectionUtil";

export default class ScheduleMode {

    static readonly SINGLE = new ScheduleMode(1, '하루', 'single')
    static readonly MULTIPLE = new ScheduleMode(2, '다중', 'multiple')
    static readonly PERIOD = new ScheduleMode(3, '기간', 'period')
    static readonly REPEAT = new ScheduleMode(4, '반복', 'repeat')

    private static readonly CACHED = CollectionUtil.toMap(ScheduleMode.values(), mode => mode.value);

    private readonly _value: number;
    private readonly _alias: string;
    private readonly _name: string

    private constructor(value: number, alias: string, name: string) {
        this._value = value;
        this._alias = alias;
        this._name = name
    }

    get value(): number {
        return this._value;
    }

    get alias(): string {
        return this._alias;
    }

    get name(): string {
        return this._name
    }

    isIn(...others: ScheduleMode[]) {
        return others.some(other => other.value === this.value);
    }

    isNotIn(...others: ScheduleMode[]) {
        return others.every(other => other.value !== this.value);
    }

    isRepeat() {
        return this._value === ScheduleMode.REPEAT.value;
    }

    toSelectOption() {
        return new SelectOption(String(this._value), this._alias);
    }

    static fromValue(value: number): ScheduleMode | undefined {
        return ScheduleMode.CACHED.get(value);
    }

    static values(): ScheduleMode[] {
        return [
            ScheduleMode.SINGLE,
            ScheduleMode.MULTIPLE,
            ScheduleMode.PERIOD,
            ScheduleMode.REPEAT
        ];
    }

}
