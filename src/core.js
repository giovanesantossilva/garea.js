
class Core {

    constructor(idCanvas) {
        if(typeof idCanvas !== 'string') {
            throw new Error('Type invalid of identifier canvas');
        }
        this._canvas = document.getElementById(idCanvas);
        this._context = this._canvas.getContext('2d');
        this._resolution = {
            width: this._canvas.offsetWidth,
            height: this._canvas.offsetHeight
        };
        this._draws = new Map();
    }

    addDraw(name, config) {
        const draw = new Draw(this._canvas, this._context);
        draw.setConfig(config);
        draw.setRecreate(this.create.bind(this));
        draw.setResolution(this._resolution);
        this._draws.set(name, draw);
    }

    getDraw(name) {
        return this._draws.get(name);
    }

    setEdit(name) {
        const draw = this._draws.get(name);
        draw._createListeners();
        this.create();
    }

    create() {
        this._clear();
        this._draws.forEach(draw => {
            draw._create();
        });
    }

    _clear() {
        this._context.clearRect(0, 0, this._resolution.width, this._resolution.height);
    }

}
