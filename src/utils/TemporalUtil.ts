import DateUtil from "@/utils/DateUtil";
import moment, {tz} from "moment-timezone";
import CalendarDate from "@/classes/CalendarDate";

const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60;
const SECONDS_IN_DAY = SECONDS_IN_HOUR * 24;
const SECONDS_IN_HALF_DAY = SECONDS_IN_HOUR * 12;

function getOffsetSecond(): number {
    return SECONDS_IN_MINUTE * tz(DateUtil.DEFAULT_TIME_ZONE).utcOffset();
}

function getEpochSecond(isLocalTime: boolean = true): number {
    return moment().utc(isLocalTime).unix();
}

function isAfterNoon(seconds: number): boolean {
    return seconds >= SECONDS_IN_HOUR * 12;
}

function secondsToTimeStr(remainSeconds: number, ignoreSeconds?: boolean, needOperator?: boolean) {
    let absRemainSeconds = Math.abs(remainSeconds);
    if (absRemainSeconds === 0) {
        return '00:00' + (ignoreSeconds ? '' : ':00')
    }


    const isNegative = remainSeconds < 0;
    const days = Math.floor(absRemainSeconds / SECONDS_IN_DAY);
    absRemainSeconds -= days * SECONDS_IN_DAY;
    const hours = Math.floor(absRemainSeconds / SECONDS_IN_HOUR);
    absRemainSeconds -= hours * SECONDS_IN_HOUR;
    const minutes = Math.floor(absRemainSeconds / SECONDS_IN_MINUTE);
    absRemainSeconds -= minutes * SECONDS_IN_MINUTE;
    const seconds = absRemainSeconds;

    const daysStr = days > 0 ? days + "일 " : "";
    const hour = String(`${hours}`).padStart(2, "0");
    const minute = String(`${minutes}`).padStart(2, "0");
    const second = String(`${seconds}`).padStart(2, "0");

    const operator = needOperator ? (isNegative ? '-' : '+') : ''
    const timeSuffix = [hour, minute, second].filter((temporal, idx) => !ignoreSeconds || (ignoreSeconds && idx !== 2)).join(':')
    return operator + daysStr + timeSuffix
}

function toMoment(timestamp: number, isLocalTime: boolean) {
    return moment.unix(timestamp).utc(isLocalTime);
}

function toLocalMoment(timestamp: number) {
    return toMoment(timestamp, true);
}

function getDiffDays(startTimeStamp: number, endTimeStamp: number) {
    if (!endTimeStamp) {
        return 0;
    }
    const diffSecond = endTimeStamp - startTimeStamp;
    const divided = diffSecond / SECONDS_IN_DAY;

    return Math.round(divided);
}

function getLocalDaysArray(startStamp: number, days: number) {
    return [...Array(days).keys()].map((_, idx) => {
        const addSecondOfDays = idx * SECONDS_IN_DAY;
        return new CalendarDate(startStamp + addSecondOfDays);
    });
}

function toUnix(timestamp: number) {
    return timestamp - getOffsetSecond();
}

function toDateTimeStr(timestamp: number) {
    return toLocalMoment(timestamp).format(DateUtil.DEFAULT_DATE_TIME_FORMAT);
}

function toDateStr(timestamp: number) {
    return toLocalMoment(timestamp).format(DateUtil.DEFAULT_DATE_FORMAT);
}

function to(timestamp: number, format: string) {
    return toLocalMoment(timestamp).format(format)
}


export default {
    SECONDS_IN_MINUTE,
    SECONDS_IN_HOUR,
    SECONDS_IN_DAY,
    SECONDS_IN_HALF_DAY,
    getOffsetSecond,
    getEpochSecond,
    secondsToTimeStr,
    isAfterNoon,
    toMoment,
    toLocalMoment,
    getDiffDays,
    getLocalDaysArray,
    toUnix,
    toDateTimeStr,
    toDateStr,
    to
}
