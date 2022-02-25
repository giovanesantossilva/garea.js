class Draw {

    constructor(canvas, context) {
        this._canvas = canvas;
        this._context = context;
        this._config = null;
        this._drags = null;
        this._points = null;
        this._resolution = null;
        this._colors = {
            points: 'rgb(47, 177, 255)',
            stroke: 'rgb(47, 177, 255)',
            area: 'rgba(47, 175, 255, 0.5)'
        };
        this._callback = {
            onchange: () => {},
            onmouseup: () => {},
            onmousedown: () => {}
        };
        this._recreate = () => {};
    }

    getConfig() {
        return this._config;
    }

    setConfig(config) {
        this._config = this._validateConfig(config);
    }

    getPoints() {
        return Object.values(this._points);
    }

    setPoints(points) {
        this._drags = {};
        this._points = {};
        points.forEach((point, index) => {
            this._drags[`p${index + 1}`] = false;
            this._points[`p${index + 1}`] = point;
        });
    }

    getResolution() {
        return this._resolution;
    }

    setResolution(resolution) {
        this._resolution = this._validateResolution(resolution);
    }

    setColor(key, value) {
        if(this._colors.hasOwnProperty(key)) {
            this._colors[key] = value;
        }
        return this;
    }

    setRecreate(recreate) {
        this._recreate = recreate;
    }

    onListener(event, callback) {
        if(this._callback.hasOwnProperty(event)) {
            this._callback[event] = callback;
        }
        return this;
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
        return config;
    }

    _validateResolution(resolution) {
        if(typeof resolution !== 'object') {
            throw Error('Type invalid of config area');
        }
        if(!resolution.hasOwnProperty('width')) {
            resolution.width = window.screen.width;
        }
        if(!resolution.hasOwnProperty('height')) {
            resolution.height = window.screen.height;
        }
        return resolution;
    }

    _validatePoints() {
        if(this._points) return;
        this.setPoints([
            { x: this._config.margin, y: this._config.margin },
            { x: (this._resolution.width - this._config.margin) / 2, y: this._config.margin },
            { x: this._resolution.width - this._config.margin, y: this._config.margin },
            { x: this._resolution.width - this._config.margin, y: (this._resolution.height - this._config.margin) / 2 },
            { x: this._resolution.width - this._config.margin, y: this._resolution.height - this._config.margin },
            { x: (this._resolution.width - this._config.margin) / 2, y: this._resolution.height - this._config.margin },
            { x: this._config.margin, y: this._resolution.height - this._config.margin },
            { x: this._config.margin, y: (this._resolution.height - this._config.margin) / 2 }
        ]);
    }

    _create() {
        this._validatePoints();
        this._createArea();
        for (const point in this._points) {
            if(this._points.hasOwnProperty(point)) {
                this._createCircle(this._points[point]);
            }
        }
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

    _createCircle(point) {
        this._context.fillStyle = this._colors.points;
        this._context.beginPath();
        this._context.arc(point.x, point.y, this._config.radius, 0, Math.PI * 2, true);
        this._context.closePath();
        this._context.fill();
    }

    _createListeners() {
        this._onMouseUp();
        this._onMouseDown();
        this._onMouseMove();
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
                this._callback.onchange(this.getPoints());
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
                        this._recreate();
                    }
                }
            }
        }
    }

}

module.exports = Draw;
