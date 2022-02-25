type DrawConfigType = {
    radius?: number,
    stroke?: number,
    margin?: number
}

type DrawPointsType = {
    x: number,
    y: number
}

type DrawResolutionType ={
    width: number,
    height: number
}

declare class Draw {
    constructor(name: string, canvas: any, context: any);
    getName(): string;
    setColor(key: string, value: string): Draw;
    onListener(event: string, callback: Function): Draw;
    setConfig(config: DrawConfigType): Draw;
    getPoints(): DrawPointsType[];
    setPoints(points: DrawPointsType[]): Draw;
    setResolution(resolution: DrawPointsType): Draw;
    reset(): void;
}

export class Core {
    constructor(idCanvas: string);
    addDraw(name: string, config: DrawConfigType): void;
    getDraw(name: string): Draw;
    setEdit(name: string): void;
    create(): void;
}
