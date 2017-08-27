const path    = require('path'),
      fs      = require('fs'),
      webpack = require('webpack');

const nodeModules = {'eris-crystal': true};
fs.readdirSync('node_modules').filter(x => ['.bin'].indexOf(x) === -1).forEach(mod => nodeModules[mod] = 'commonjs ' + mod);

module.exports = {
    entry:     [
        './src/index.ts'
    ],
    target:    'node',
    output:    {
        path:     path.join(__dirname, 'build'),
        filename: 'index.js'
    },
    resolve:   {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    watchOptions: {
        poll: true
    },
    node:      {
        fs:            'empty',
        child_process: 'empty',
        __dirname:     false,
        __filename:    false,
    },
    externals: nodeModules,
    module:    {
        rules: [
            {test: /\.tsx?$/, enforce: 'pre', use: ['tslint-loader?debug=true&configFile=tslint.json&fix=true']},
            {test: /\.js$/, enforce: 'pre', use: ['source-map-loader?debug=true']},
            {test: /\.tsx?$/, use: ['ts-loader?debug=true']}
        ]
    },
    plugins:   [
        new webpack.BannerPlugin({
            banner:    'require("source-map-support").install();',
            raw:       true,
            entryOnly: false
        }),
        new webpack.IgnorePlugin(/^\.$/),
    ],
    devtool:   'source-map'
};