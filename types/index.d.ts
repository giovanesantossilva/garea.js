type DrawConfigType = {
    radius?: number,
    stroke?: number,
    margin?: number
    points?: number,
    type?: DrawConfigTypeAccept
}

type DrawPointsType = {
    x: number,
    y: number
}

type DrawConfigTypeAccept = 'line' | 'area';
type DrawResolutionAccept = 'width' | 'height';
type DrawConfigAccept = 'radius' | 'stroke' | 'margin' | 'points';
type DrawColorsAccept = 'points' | 'stroke' | 'area' | 'background';
type DrawEventsAccept = 'onchange' | 'onmouseup' | 'onmousedown';

declare class Draw {
    constructor(name: string, canvas: any, context: any);
    getName(): string;
    setColor(key: DrawColorsAccept, value: string): Draw;
    setConfig(key: DrawConfigAccept, value: number): Draw;
    setResolution(key: DrawResolutionAccept, value: number): Draw;
    onListener(event: DrawEventsAccept, callback: Function): Draw;
    getPoints(): DrawPointsType[];
    setPoints(points: DrawPointsType[]): Draw;
    reset(): void;
}

export class Core {
    constructor(idCanvas: string);
    getDraw(name: string): Draw | null;
    addDraw(name: string, config: DrawConfigType): void;
    removeDraw(name: string): void;
    setEdit(name: string): void;
    create(): void;
    clear(): void;
}
