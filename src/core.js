import { Draw } from "./draw";
import { CoreError } from "./error/coreError";

export class Core {

    #canvas = null;
    #context = null;
    #draws = new Map();
    #mount = [];

    constructor(idCanvas) {
        if (typeof idCanvas !== 'string')
            throw new CoreError('Invalid of identifier canvas!');
        this.#canvas = document.getElementById(idCanvas);
        if (!this.#canvas)
            throw new CoreError('Canvas is not found!');
        this.#context = this.#canvas.getContext('2d');
    }

    getDraw(name) {
        if (this.#draws.has(name))
            return this.#draws.get(name);
        return null;
    }

    addDraw(name, config = {}) {
        const draw = new Draw(name, this.#canvas, this.#context);
        for (const key in config) {
            if (config.hasOwnProperty(key))
                draw.setConfig(key, config[key]);
        }
        draw.setRecreate(this.create.bind(this));
        this.#draws.set(name, draw);
        this.#mount.push(draw);
    }

    removeDraw(name) {
        if (this.#draws.has(name)) {
            const draw = this.#draws.get(name);
            this.#draws.delete(name);
            this.#mount = this.#mount.filter(mount =>
                mount.getName() !== draw.getName());
            this.create();
        }
    }

    setEdit(name) {
        if (this.#draws.has(name)) {
            const draw = this.#draws.get(name);
            const mount = this.#mount.filter(mount =>
                mount.getName() !== draw.getName());
            mount.push(draw);
            this.#mount = mount;
            draw.createListeners();
            this.create();
        }
    }

    create() {
        this.clear();
        this.#mount.forEach(draw => draw.create());
    }

    clear() {
        this.#context.clearRect(0, 0, this.#canvas.offsetWidth, this.#canvas.offsetHeight);
    }

}
