class Garea {

    constructor(idCanvas, config = { }) {
        if(typeof idCanvas !== 'string') {
            throw new Error('Type invalid of identifier canvas');
        }
        this._canvas = document.getElementById(idCanvas);
        this._context = this._canvas.getContext('2d');
        this._config = this._validateConfig(config);
        this._points = null;
        this._drags = null;
        this._colors = {
            points: 'rgb(47, 177, 255)',
            stroke: 'rgb(47, 177, 255)',
            area: 'rgba(47, 175, 255, 0.5)'
        };
        this._resolution = {
            width: this._canvas.offsetWidth,
            height: this._canvas.offsetHeight
        };
        this._callback = {
            onchange: () => {},
            onmouseup: () => {},
            onmousedown: () => {}
        };
    }

    get config() {
        return this._config;
    }

    set config(config) {
        this._config = this._validateConfig(config);
    }

    get resolution() {
        return this._resolution;
    }

    set resolution(resolution) {
        this._resolution = resolution;
    }

    get points() {
        return Object.values(this._points);
    }

    set points(points) {
        this._drags = {};
        this._points = {};
        points.forEach((point, index) => {
            this._drags[`p${index + 1}`] = false;
            this._points[`p${index + 1}`] = point;
        });
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
        if(!config.hasOwnProperty('radius')) {
            config.radius = 5;
        }
        if(!config.hasOwnProperty('margin')) {
            config.margin= 30;
        }
        if(!config.hasOwnProperty('points')) {
            config.points = 4;
        }
        if(!config.hasOwnProperty('stroke')) {
            config.stroke = 4;
        }
        console.log(config);
        return config;
    }

    _validatePoints() {
        if(this._points) return;
        this.points = [
            { x: this._config.margin, y: this._config.margin },
            { x: (this._resolution.width - this._config.margin) / 2, y: this._config.margin },
            { x: this._resolution.width - this._config.margin, y: this._config.margin },
            { x: this._resolution.width - this._config.margin, y: (this._resolution.height - this._config.margin) / 2 },
            { x: this._resolution.width - this._config.margin, y: this._resolution.height - this._config.margin },
            { x: (this._resolution.width - this._config.margin) / 2, y: this._resolution.height - this._config.margin },
            { x: this._config.margin, y: this._resolution.height - this._config.margin },
            { x: this._config.margin, y: (this._resolution.height - this._config.margin) / 2 }
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
        this._context.clearRect(0, 0, this._resolution.width, this._resolution.height);
    }

    _createCircle(point) {
        this._context.fillStyle = this._colors.points;
        this._context.beginPath();
        this._context.arc(point.x, point.y, this._config.radius, 0, Math.PI * 2, true);
        this._context.closePath();
        this._context.fill();
    }

    _createArea() {
        this._context.fillStyle = this._colors.area;
        this._context.strokeStyle = this._colors.stroke;
        this._context.lineWidth = this._config.stroke;
        this._context.beginPath();
        this._context.moveTo(this._points.p1.x, this._points.p1.y);
        for (const point in this._points) {
            if(this._points.hasOwnProperty(point)) {
                this._context.lineTo(this._points[point].x, this._points[point].y);
            }
        }
        this._context.lineTo(this._points.p1.x, this._points.p1.y);
        this._context.stroke();
        this._context.closePath();
        this._context.fill();
    }

    _onMouseDown() {
        this._canvas.onmousedown = (event) => {
            for(let point in this._points) {
                if(this._points.hasOwnProperty(point)) {
                    if(
                        (event.offsetX >= this._points[point].x - (this._config.radius + 3)) &&
                        (event.offsetX <= this._points[point].x + (this._config.radius + 3)) &&
                        (event.offsetY >= this._points[point].y - (this._config.radius + 3)) &&
                        (event.offsetY <= this._points[point].y + (this._config.radius + 3))
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
            this._drags = {};
            for (const point in this._points) {
                if(this._points.hasOwnProperty(point)) {
                    this._drags[point] = false;
                }
            }
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
