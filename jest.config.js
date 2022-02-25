module.exports = {
    bail: true,
    clearMocks: true,
    coverageProvider: "v8",
    setupFiles: [ "jest-canvas-mock" ],
    testMatch: [ "**/__tests__/**/*.test.js?(x)" ]
};
