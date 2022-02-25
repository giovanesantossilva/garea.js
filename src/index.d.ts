import { Draw } from './draw';

export type DrawConfigType = {
    radius: number,
    stroke: number,
    margin: number
}

export type DrawPointsType = {
    x: number,
    y: number
}

export type DrawResolutionType ={
    width: number,
    height: number
}

export type CoreType = {
    addDraw: (name: string, config: DrawConfigProps) => void,
    getDraw: (name: string) => Draw,
    setEdit: (name: string) => void,
    create: () => void
}

export type DrawType = {
    getName: () => string,
    setColor: (key: string, value: string) => Draw,
    onListener: (event: string, callback: Function) => Draw,
    setConfig: (config: DrawConfigProps) => Draw,
    getPoints: () => Array<DrawPointsType>,
    setPoints: (points: Array<DrawPointsType>) => Draw,
    setResolution: (resolution: DrawResolutionType) => Draw,
    reset: () => void
};
