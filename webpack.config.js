const path = require('path');
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    entry: ["./src/entry.ts"],
    watch: false,
    output: {
        path: path.resolve('./dist'),
        filename: "index.js",
        libraryTarget: 'umd',
        library: 'ecs-imagerenderersystem'
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                // exclude:/\.spec.ts?$/,
                loader: 'ts-loader'
            }
        ]
    },
    resolve: {
        extensions: [ '.ts' ]
    },
    externals: 
    {
        "ecs-framework": "umd ecs-framework",
        "gl-matrix": "gl-matrix"
    },
    // plugins: [new UglifyJSPlugin({ sourceMap : true })]
};