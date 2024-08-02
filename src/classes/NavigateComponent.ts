export default class NavigateComponent {
    private readonly _title: string;
    private readonly _name: string;
    private readonly _props?: any;

    constructor(title: string, name: string, props?: any) {
        this._title = title;
        this._name = name;
        this._props = props;
    }

    get title(): string {
        return this._title;
    }

    get name(): string {
        return this._name;
    }

    get props(): any | undefined {
        return this._props;
    }
}
