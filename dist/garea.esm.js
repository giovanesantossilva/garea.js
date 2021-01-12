class Garea {

    constructor(idCanvas, config = { r: 5, m: 30 }) {
        this._canvas = document.getElementById(idCanvas);
        this._context = this._canvas.getContext('2d');
        this._points = null;
        this._config = config;
        this._drags = { p1: false, p2: false, p3: false, p4: false };
        this._colors = { area: 'rgba(47, 175, 255, 0.58)', points: 'rgb(47, 177, 255)' };
        this._resolution = { w: this._canvas.offsetWidth, h: this._canvas.offsetHeight };
        this._callback = { onmousedown: () => {}, onmouseup: () => {}, onchange: () => {} };
    }

    set config(config) {
        this._config = config;
    }

    set resolution(resolution) {
        this._resolution = resolution;
    }

    set points(points) {
        this._points = { p1: points[0], p2: points[1], p3: points[2], p4: points[3] };
    }

    get points() {
        return Object.values(this._points);
    }

    setColor(key, value) {
        if(this._colors.hasOwnProperty(key)) {
            this._colors[key] = value;
        }
    }

    onListener(event, callback) {
        if(this._callback.hasOwnProperty(event)) {
            this._callback[event] = callback;
        }
    }

    reset() {
        this._points = null;
        this.draw();
        this._callback.onchange(this.points);
    }

    _validatePoints() {
        if(this._points) return;
        this.points = [
            { x: this._config.m, y: this._config.m },
            { x: this._resolution.w - this._config.m, y: this._config.m },
            { x: this._resolution.w - this._config.m, y: this._resolution.h - this._config.m },
            { x: this._config.m, y: this._resolution.h - this._config.m }
        ];
    }

    draw() {
        this._clear();
        this._validatePoints();
        this._createArea();
        this._createCircle(this._points.p1);
        this._createCircle(this._points.p2);
        this._createCircle(this._points.p3);
        this._createCircle(this._points.p4);
        this._onMouseDown();
        this._onMouseUp();
        this._onMouseMove();
    }

    _clear() {
        this._context.clearRect(0, 0, this._resolution.w, this._resolution.h);
    }

    _createCircle(point) {
        this._context.beginPath();
        this._context.arc(point.x, point.y, this._config.r, 0, Math.PI * 2, true);
        this._context.fillStyle = this._colors.points;
        this._context.closePath();
        this._context.fill();
    }

    _createArea() {
        this._context.fillStyle = this._colors.area;
        this._context.beginPath();
        this._context.moveTo(this._points.p1.x, this._points.p1.y);
        this._context.lineTo(this._points.p2.x, this._points.p2.y);
        this._context.lineTo(this._points.p3.x, this._points.p3.y);
        this._context.lineTo(this._points.p4.x, this._points.p4.y);
        this._context.lineTo(this._points.p1.x, this._points.p1.y);
        this._context.closePath();
        this._context.fill();
    }

    _onMouseDown() {
        this._canvas.onmousedown = (event) => {
            for(let point in this._points) {
                if(this._points.hasOwnProperty(point)) {
                    if(
                        (event.offsetX >= this._points[point].x - (this._config.r + 3)) &&
                        (event.offsetX <= this._points[point].x + (this._config.r + 3)) &&
                        (event.offsetY >= this._points[point].y - (this._config.r + 3)) &&
                        (event.offsetY <= this._points[point].y + (this._config.r + 3))
                    ) {
                        this._drags[point] = true;
                        this._canvas.style.cursor = 'crosshair';
                    }
                }
            }
            this._callback.onmousedown({ x: event.offsetX, y: event.offsetY });
        };
    }

    _onMouseUp() {
        this._canvas.onmouseup = event => {
            if(Object.values(this._drags).indexOf(true) !== -1) {
                this._callback.onchange(this.points);
            }
            this._canvas.style.cursor = 'default';
            this._drags = { p1: false, p2: false, p3: false, p4: false };
            this._callback.onmouseup({ x: event.offsetX, y: event.offsetY });
        };
    }

    _onMouseMove() {
        this._canvas.onmousemove = (event) => {
            for (let drag in this._drags) {
                if(this._drags[drag]) {
                    this._points[drag] =  { x: event.offsetX, y: event.offsetY };
                    this.draw();
                }
            }
        };
    }

}

exports.Garea = Garea;
