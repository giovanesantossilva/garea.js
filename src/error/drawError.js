export class DrawError extends Error {

    constructor(message) {
        super(`[~Draw] ${message}`);
        this.name = "DrawError";
    }

}
