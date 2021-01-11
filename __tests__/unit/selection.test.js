const { Garea } = require('../../src');

describe("Selection area", () => {

    beforeAll(() => {
        document.body.innerHTML = `
            <canvas id="crop" style="width: 600px; height: 400px; position: absolute; z-index: 9"></canvas>
        `;
    });

    it("should garea class instanced.", () => {
        const area = new Garea('crop');
        expect(area).toBeDefined();
    });

    it("should set configuration is correctly.", () => {
        const config = { r: 7, m: 30 };
        const area = new Garea('crop', config);
        expect(area._config).toEqual(config);
    });

    it("should set configuration is correctly use function.", () => {
        const config = { r: 7, m: 30 };
        const area = new Garea('crop');
        area.config = config
        expect(area._config).toEqual(config);
    });

    it("should change default color for area and points.", () => {
        const colors = {
            area: 'rgba(255, 0, 0, 0.58)',
            points: 'rgb(255, 0, 0)'
        };
        const area = new Garea('crop');
        area.setColor('area', colors.area);
        area.setColor('points', colors.points);
        expect(area._colors).toEqual(colors);
    });

    it('should draw area in canvas without set points.', () => {
        const area = new Garea('crop');
        area.draw();
        expect(area._points).toBeDefined()
    });

    it('should draw area in canvas with set points.', () => {
        const area = new Garea('crop');
        area.points = [{x: 20, y: 20}, {x: 181, y: 21}, {x: 187, y: 137}, {x: 28, y: 140}];
        area.draw();
        expect(area._points).toBeDefined()
    });

    it('should reset area in canvas.', () => {
        const received = [{x: 20, y: 20}, {x: 181, y: 21}, {x: 187, y: 137}, {x: 28, y: 140}];
        const area = new Garea('crop');
        area.points = received;
        area.draw();
        area.reset()
        const points = Object.values(area._points);
        expect(points).not.toEqual(received);
    });

});