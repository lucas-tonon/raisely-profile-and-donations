const config = {
    verbose: true,
    collectCoverage: true,
    coveragePathIgnorePatterns: [
        'node_modules',
        'src/index',
        'src/utils/errors'
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: -10,
        },
    },
};

module.exports = config;