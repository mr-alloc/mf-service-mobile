import {defineStore} from "pinia";
import {ref} from "vue";
import TemporalUtil from '@/utils/TemporalUtil'

export const useAlertStore = defineStore('alert', () => {

    const notifications = ref<Array<Notification>>([]);

    function alert(type: AlertType, title: string, message: string, timeoutSecond?: number) {
        const notification = new Notification(type, title, message);

        if (notifications.value.length >= 3) {
            notifications.value[0].visible = false
            setTimeout(() => {
                notifications.value.shift()
                queueNotification(notification, timeoutSecond)
            }, 400)
        } else {
            queueNotification(notification, timeoutSecond)
        }
    }

    function queueNotification(notification: Notification, timeoutSecond?: number) {
        notifications.value.push(notification)

        setTimeout(() => {
            const filtered = notifications.value
                .filter(alert => {
                    const condition = alert.timestamp !== notification.timestamp
                    if (!condition) {
                        alert.visible = false
                    }
                    return condition
                });
            setTimeout(() => notifications.value = filtered, 400)

        }, (timeoutSecond ?? 5) * 1000);

    }

    function clear() {
        notifications.value = [];
    }

    function warning(title: string, message: string, timeoutSecond?: number) {
        alert(AlertType.WARNING, title, message, timeoutSecond);
    }

    function info(title: string, message: string, timeoutSecond?: number) {
        alert(AlertType.INFO, title, message, timeoutSecond);
    }

    function success(title: string, message: string, timeoutSecond?: number) {
        alert(AlertType.SUCCESS, title, message, timeoutSecond);
    }

    function guide(title: string, message: string, timeoutSecond?: number) {
        alert(AlertType.GUIDE, title, message, timeoutSecond);
    }

    function none(title: string, message: string, timeoutSecond?: number) {
        alert(AlertType.NONE, title, message, timeoutSecond);
    }

    return {
        notifications,
        alert,
        clear,
        warning,
        info,
        success,
        guide,
        none
    }
})

export type AlertStore = ReturnType<typeof useAlertStore>;

export class Notification {
    private readonly _timestamp: number;
    private readonly _type: AlertType;
    private readonly _title: string;
    private readonly _message: string;
    private _visible: boolean

    constructor(type: AlertType, title: string, message: string) {
        this._timestamp = TemporalUtil.getEpochSecond(false)
        this._type = type;
        this._title = title;
        this._message = message;
        this._visible = true
    }

    get timestamp(): number {
        return this._timestamp;
    }

    get type(): AlertType {
        return this._type;
    }

    get title(): string {
        return this._title;
    }

    get message(): string {
        return this._message;
    }

    get visible(): boolean {
        return this._visible
    }

    public set visible(visible: boolean) {
        this._visible = visible
    }
}

export enum AlertType {
    INFO = "info",
    WARNING = "warning",
    SUCCESS = "success",
    GUIDE = "guide",
    NONE = "none"
}
