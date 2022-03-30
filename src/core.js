import { Draw } from "./draw";

export class Core {

    constructor(idCanvas) {
        if (typeof idCanvas !== 'string') {
            throw new Error('Type invalid of identifier canvas');
        }
        this._canvas = document.getElementById(idCanvas);
        this._context = this._canvas.getContext('2d');
        this._resolution = {
            width: this._canvas.offsetWidth,
            height: this._canvas.offsetHeight
        };
        this._draws = new Map();
        this._mount = [];
    }

    addDraw(name, config) {
        const draw = new Draw(name, this._canvas, this._context);
        draw.setConfig(config);
        draw.setResolution(this._resolution);
        draw._setRecreate(this.create.bind(this));
        this._draws.set(name, draw);
        this._mount.push(draw);
    }

    getDraw(name) {
        return this._draws.get(name);
    }

    removeDraw(name) {
        this._draws.delete(name);
        this.create();
    }

    setEdit(name) {
        const draw = this._draws.get(name);
        const mount = this._mount.filter(mount =>
            mount.getName() !== draw.getName());
        mount.push(draw);
        this._mount = mount;
        draw._createListeners();
        this.create();
    }

    create() {
        this._clear();
        this._mount.forEach(draw => {
            draw._create();
        });
    }

    _clear() {
        this._context.clearRect(0, 0, this._resolution.width, this._resolution.height);
    }

}
