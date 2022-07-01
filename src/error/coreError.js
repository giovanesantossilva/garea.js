export class CoreError extends Error {

    constructor(message) {
        super(`[~Core] ${message}`);
        this.name = "CoreError";
    }

}
