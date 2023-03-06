import { Core } from "../../src/core";
import { CoreError } from "../../src/error/coreError";
import { DrawError } from "../../src/error/drawError";

describe("Core functions", () => {

    beforeAll(function () {
        document.body.innerHTML = `
            <canvas id="crop" width="600" height="400" style="position: absolute; z-index: 9"></canvas>
        `;
    });

    it("should core class instanced.", function () {
        expect(new Core('crop')).toBeDefined();
    });

    it("should core not class instanced.", function () {
        expect(() => new Core(1)).toThrow(CoreError);
    });

    it("should add new Draw to instanced.", function () {
        const crop = new Core('crop');
        crop.addDraw('area', {});
        expect(crop.getDraw('area')).toBeDefined();
    });

    it("should add new Draw not instanced.", function () {
        const crop = new Core('crop');
        expect(() => crop.addDraw(1, {})).toThrow(DrawError);
    });

    it("should add two Draws and to instanced.", function () {
        const crop = new Core('crop');
        crop.addDraw('area1', {});
        expect(crop.getDraw('area1')).toBeDefined();
        crop.addDraw('area2', {});
        expect(crop.getDraw('area2')).toBeDefined();
    });

    it("should set edit is correctly.", function () {
        const crop = new Core('crop');
        crop.addDraw('area', {});
        crop.setEdit('area');
        expect(crop.getDraw('area')).toBeDefined();
    });

    it('should set configuration correctly.', function () {
        const crop = new Core('crop');
        const config = { radius: 5, stroke: 4, points: 4, margin: 50, type: 'area' };
        crop.addDraw('area', config);
        const area = crop.getDraw('area');
        expect(area.config).toEqual(config);
    });

    it("should change default color for area, points and stroke.", () => {
        const crop = new Core('crop');
        crop.addDraw('area', {});
        const colors = {
            area: 'rgba(255, 0, 0, 0.58)',
            points: 'rgb(255, 0, 0)',
            stroke: 'rgb(255, 0, 0)',
            background: 'rgba(0, 0, 0, .6)'
        };
        const area = crop.getDraw('area');
        area.setColor('area', colors.area);
        area.setColor('points', colors.points);
        area.setColor('stroke', colors.stroke);
        area.setColor('background', colors.background);
        expect(area.colors).toEqual(colors);
    });

    it("should draw area in canvas without set points.", function () {
        const crop = new Core('crop');
        crop.addDraw('area', {});
        crop.create();
        const area = crop.getDraw('area');
        expect(area.getPoints()).toBeDefined()
    });

    it("should draw area in canvas with set points.", function () {
        const crop = new Core('crop');
        crop.addDraw('area', {});
        crop.create();
        const area = crop.getDraw('area');
        const points = [{x: 20, y: 20}, {x: 181, y: 21}, {x: 187, y: 137}, {x: 28, y: 140}];
        area.setPoints(points);
        expect(area.getPoints()).toEqual(points);
    });

    it('should reset area in canvas.', function () {
        const crop = new Core('crop');
        crop.addDraw('area', {});
        const area = crop.getDraw('area');
        const points = [{x: 20, y: 20}, {x: 181, y: 21}, {x: 187, y: 137}, {x: 28, y: 140}];
        area.setPoints(points);
        crop.create();
        area.reset();
        expect(area.getPoints()).not.toEqual(points);
    });

    it('should set and get points of area selected.', function () {
        const crop = new Core('crop');
        crop.addDraw('area', {});
        let points = [];
        const received = [{x: 20, y: 20}, {x: 181, y: 21}, {x: 187, y: 137}, {x: 28, y: 140}];
        const area = crop.getDraw('area');
        area.setPoints(received);
        crop.create();
        area.onListener('onchange', event => {
            points = event;
        });
        area.reset();
        expect(points).toEqual(area.getPoints());
    });

});
