class Garea {

    constructor(idCanvas, config = { }) {
        if(idCanvas instanceof String) {
            throw new Error('Type invalid of identifier canvas');
        }
        this._canvas = document.getElementById(idCanvas);
        this._config = this._validateConfig(config);
        this._context = this._canvas.getContext('2d');
        this._points = null;
        this._drags = null;
        this._colors = {
            points: 'rgb(47, 177, 255)',
            area: 'rgba(47, 175, 255, 0.5)'
        };
        this._resolution = {
            w: this._canvas.offsetWidth,
            h: this._canvas.offsetHeight
        };
        this._callback = {
            onchange: () => {},
            onmouseup: () => {},
            onmousedown: () => {}
        };
    }

    set config(config) {
        this._config = this._validateConfig(config);
    }

    set resolution(resolution) {
        this._resolution = resolution;
    }

    set points(points) {
        this._drags = {};
        this._points = {};
        points.forEach((point, index) => {
            this._drags[`p${index + 1}`] = false;
            this._points[`p${index + 1}`] = point;
        });
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

    _validateConfig(config) {
        if(typeof config !== 'object') {
            throw Error('Type invalid of config area');
        }
        if(!config.hasOwnProperty('r')) {
            config.r = 5;
        }
        if(!config.hasOwnProperty('m')) {
            config.m = 30;
        }
        return config;
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
        for (const point in this._points) {
            if(this._points.hasOwnProperty(point)) {
                this._createCircle(this._points[point]);
            }
        }
        this._onMouseDown();
        this._onMouseUp();
        this._onMouseMove();
    }

    _clear() {
        this._context.clearRect(0, 0, this._resolution.w, this._resolution.h);
    }

    _createCircle(point) {
        this._context.fillStyle = this._colors.points;
        this._context.beginPath();
        this._context.arc(point.x, point.y, this._config.r, 0, Math.PI * 2, true);
        this._context.closePath();
        this._context.fill();
    }

    _createArea() {
        this._context.fillStyle = this._colors.area;
        this._context.beginPath();
        this._context.moveTo(this._points.p1.x, this._points.p1.y);
        for (const point in this._points) {
            if(this._points.hasOwnProperty(point)) {
                this._context.lineTo(this._points[point].x, this._points[point].y);
            }
        }
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
        }
    }

    _onMouseUp() {
        this._canvas.onmouseup = event => {
            if(Object.values(this._drags).indexOf(true) !== -1) {
                this._callback.onchange(this.points);
            }
            this._canvas.style.cursor = 'default';
            this._drags = { p1: false, p2: false, p3: false, p4: false };
            this._callback.onmouseup({ x: event.offsetX, y: event.offsetY });
        }
    }

    _onMouseMove() {
        this._canvas.onmousemove = (event) => {
            for (let drag in this._drags) {
                if(this._drags.hasOwnProperty(drag)) {
                    if(this._drags[drag]) {
                        this._points[drag] =  { x: event.offsetX, y: event.offsetY };
                        this.draw();
                    }
                }
            }
        }
    }

}

module.exports = Garea;
