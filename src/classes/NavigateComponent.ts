export default class NavigateComponent {
    private readonly _title: string;
    private readonly _name: string;
    private _visible: boolean
    private readonly _props?: any;

    constructor(title: string, name: string, props?: any) {
        this._title = title;
        this._name = name;
        this._visible = true
        this._props = props;
    }

    get title(): string {
        return this._title;
    }

    get name(): string {
        return this._name;
    }

    get visible(): boolean {
        return this._visible
    }

    notVisible(): void {
        this._visible = false
    }

    get props(): any | undefined {
        return this._props;
    }
}
