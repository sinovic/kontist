// webpack.common.js - common webpack config
// const LEGACY_CONFIG = 'legacy';
// const MODERN_CONFIG = 'modern';

// node modules
const path = require('path');

// config files
const pkg = require('./package.json');
const settings = require('./webpack.settings.js');

// Configure Babel loader
const configureBabelLoader = () => {
    return {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: [
                    [
                        '@babel/preset-env', {
                        modules: false,
                        useBuiltIns: 'entry',
                        // targets: {
                        //     browsers: browserList,
                        // },
                    }
                    ],
                ],
                plugins: [
                    // '@babel/plugin-syntax-dynamic-import',
                    // [
                    //     "@babel/plugin-transform-runtime", {
                    //         "regenerator": true
                    //     }
                    // ]
                ],
            },
        },
    };
};

// Configure Entries
const configureEntries = () => {
    let entries = {};
    for (const [key, value] of Object.entries(settings.entries)) {
        entries[key] = path.resolve(__dirname, settings.paths.src.js + value);
    }

    return entries;
};

// Configure Font loader
const configureFontLoader = () => {
    return {
        test: /\.(ttf|eot|woff2?)$/i,
        use: [
            {
                loader: 'file-loader',
                options: {
                    name: 'fonts/[name].[ext]'
                }
            }
        ]
    };
};


// Common module exports
// noinspection WebpackConfigHighlighting
module.exports = {
    name: pkg.name,
    entry: configureEntries(),
    output: {
        path: path.resolve(__dirname, settings.paths.dist.base),
        publicPath: settings.urls.publicPath()
    },
    module: {
        rules: [
            configureBabelLoader(),
            configureFontLoader(),
        ],
    },
    plugins: [

    ]
};
