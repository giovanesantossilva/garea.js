import { DrawError } from "./error/drawError";

export class Draw {

    #name = null;
    #canvas = null;
    #context = null;
    #drags = null;
    #points = null;
    #disable = false;
    #config = {
        radius: 5,
        margin: 30,
        points: 4,
        stroke: 2,
        type: 'area'
    }
    #colors = {
        points: 'rgb(47, 177, 255)',
        stroke: 'rgb(47, 177, 255)',
        area: 'rgba(47, 175, 255, .5)',
        background: 'rgba(0, 0, 0, .6)'
    }
    #resolution = {
        width: window.screen.width,
        height: window.screen.height
    };
    #callbacks = {
        onchange: function () { },
        onmouseup: function () { },
        onmousedown: function () { }
    }
    #recreate = function () { }

    constructor(name, canvas, context) {
        if (typeof name != 'string') {
            throw new DrawError('Type invalid of identifier name!');
        }
        this.#name = name;
        this.#canvas = canvas;
        this.#context = context;
        this.#resolution = {
            width: this.#canvas.offsetWidth,
            height: this.#canvas.offsetHeight
        }
    }

    get config() {
        return this.#config;
    }

    get colors() {
        return this.#colors;
    }

    getName() {
        return this.#name;
    }

    setName(name) {
        this.#name = name;
    }

    setRecreate(recreate) {
        this.#recreate = recreate;
    }

    setColor(key, value) {
        if (this.#colors.hasOwnProperty(key)) {
            this.#colors[key] = value;
        }
        return this;
    }

    setConfig(key, value) {
        if (this.#config.hasOwnProperty(key)) {
            this.#config[key] = value;
        }
        return this;
    }

    setResolution(key, value) {
        if (this.#resolution.hasOwnProperty(key)) {
            this.#resolution[key] = value;
        }
        return this;
    }

    setDisable(state) {
        if (typeof state !== 'boolean') {
            throw new DrawError('Type invalid of state!');
        }
        this.#disable = state;
        return this;
    }

    isDisable() {
        return this.#disable;
    }

    onListener(event, callback) {
        if (this.#callbacks.hasOwnProperty(event)) {
            this.#callbacks[event] = callback;
        }
        return this;
    }

    getPoints() {
        return Object.values(this.#points);
    }

    setPoints(points) {
        if (this.#config.type === 'line' && points.length > 2) {
            throw new DrawError('Line type must have only two points');
        }
        if (this.#config.type === 'area' && points.length < 3) {
            throw new DrawError('Area type must have three points or more');
        }
        this.#drags = {};
        this.#points = {};
        points.forEach((point, index) => {
            this.#drags[`p${index + 1}`] = false;
            this.#points[`p${index + 1}`] = point;
        });
        return this;
    }

    #validatePoints() {
        if(this.#points) return;
        if (this.#config.type === 'line') {
            this.setPoints([
                { x: this.#resolution.width * .25, y: this.#resolution.height / 2 },
                { x: this.#resolution.width * .75, y: this.#resolution.height / 2 }
            ]);
        }
        if (this.#config.type === 'area') {
            this.setPoints([
                { x: this.#config.margin, y: this.#config.margin },
                { x: (this.#resolution.width - this.#config.margin) / 2, y: this.#config.margin },
                { x: this.#resolution.width - this.#config.margin, y: this.#config.margin },
                { x: this.#resolution.width - this.#config.margin, y: (this.#resolution.height - this.#config.margin) / 2 },
                { x: this.#resolution.width - this.#config.margin, y: this.#resolution.height - this.#config.margin },
                { x: (this.#resolution.width - this.#config.margin) / 2, y: this.#resolution.height - this.#config.margin },
                { x: this.#config.margin, y: this.#resolution.height - this.#config.margin },
                { x: this.#config.margin, y: (this.#resolution.height - this.#config.margin) / 2 }
            ]);
        }
    }

    reset() {
        this.#points = null;
        this.#recreate();
        this.#callbacks.onchange(this.getPoints());
    }

    create() {
        this.#validatePoints();
        this.#background();
        this.#clearArea();
        this.#createArea();
        for (const point in this.#points) {
            if(this.#points.hasOwnProperty(point)) {
                this.#createCircle(this.#points[point]);
            }
        }
    }

    #background() {
        this.#context.fillStyle = this.#colors.background;
        this.#context.fillRect(0, 0, this.#resolution.width, this.#resolution.height);
    }

    #drawArea() {
        this.#context.beginPath();
        this.#context.moveTo(this.#points.p1.x, this.#points.p1.y);
        for (const point in this.#points) {
            if(this.#points.hasOwnProperty(point)) {
                this.#context.lineTo(this.#points[point].x, this.#points[point].y);
            }
        }
        this.#context.lineTo(this.#points.p1.x, this.#points.p1.y);
        this.#context.closePath();
    }

    #createArea() {
        this.#context.globalCompositeOperation = 'source-over';
        this.#context.fillStyle = this.#colors.area;
        this.#context.strokeStyle = this.#colors.stroke;
        this.#context.lineWidth = this.#config.stroke;
        this.#drawArea();
        this.#context.stroke();
        this.#context.fill();
    }

    #clearArea() {
        this.#context.globalCompositeOperation = 'destination-out';
        this.#drawArea();
        this.#context.fill();
    }

    #createCircle(point) {
        this.#context.fillStyle = this.#colors.points;
        this.#context.beginPath();
        this.#context.arc(point.x, point.y, this.#config.radius, 0, Math.PI * 2, true);
        this.#context.closePath();
        this.#context.fill();
    }

    createListeners() {
        this.#canvas.onmouseup = this.#onMouseUp.bind(this);
        this.#canvas.onmouseout = this.#onMouseOut.bind(this);
        this.#canvas.onmousedown = this.#onMouseDown.bind(this);
        this.#canvas.onmousemove = this.#onMouseMove.bind(this);
    }

    #onMouseOut() {
        this.#canvas.style.cursor = 'default';
        this.#drags = {};
        for (const point in this.#points) {
            if(this.#points.hasOwnProperty(point)) {
                this.#drags[point] = false;
            }
        }
    }

    #onMouseDown(event) {
        for(let point in this.#points) {
            if(this.#points.hasOwnProperty(point)) {
                if(
                    (event.offsetX >= this.#points[point].x - (this.#config.radius + 3)) &&
                    (event.offsetX <= this.#points[point].x + (this.#config.radius + 3)) &&
                    (event.offsetY >= this.#points[point].y - (this.#config.radius + 3)) &&
                    (event.offsetY <= this.#points[point].y + (this.#config.radius + 3))
                ) {
                    this.#drags[point] = true;
                    this.#canvas.style.cursor = 'crosshair';
                    break;
                }
            }
        }
        this.#callbacks.onmousedown({ x: event.offsetX, y: event.offsetY });
    }

    #onMouseUp(event) {
        if(Object.values(this.#drags).indexOf(true) !== -1) {
            this.#callbacks.onchange(this.getPoints());
        }
        this.#canvas.style.cursor = 'default';
        this.#drags = {};
        for (const point in this.#points) {
            if(this.#points.hasOwnProperty(point)) {
                this.#drags[point] = false;
            }
        }
        this.#callbacks.onmouseup({ x: event.offsetX, y: event.offsetY });
    }

    #onMouseMove(event) {
        if (this.#disable) return;
        if(
            event.offsetX > this.#config.radius && event.offsetX <= (this.#resolution.width - this.#config.radius) &&
            event.offsetY > this.#config.radius && event.offsetY <= (this.#resolution.height - this.#config.radius)
        ) {
            for (let drag in this.#drags) {
                if(this.#drags.hasOwnProperty(drag)) {
                    if(this.#drags[drag]) {
                        this.#points[drag] =  { x: event.offsetX, y: event.offsetY };
                        this.#recreate();
                    }
                }
            }
        }
    }

}
