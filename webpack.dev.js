// webpack.dev.js - developmental builds
const LEGACY_CONFIG = 'legacy';
const MODERN_CONFIG = 'modern';

// node modules
const merge = require('webpack-merge');
const path = require('path');
const sane = require('sane');
const webpack = require('webpack');

// webpack plugins
const Dashboard = require('webpack-dashboard');
const DashboardPlugin = require('webpack-dashboard/plugin');
const dashboard = new Dashboard();
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');


// config files
const common = require('./webpack.common.js');
const pkg = require('./package.json');
const settings = require('./webpack.settings.js');

// Configure the webpack-dev-server
const configureDevServer = () => {
    return {
        public: settings.devServerConfig.public(),
        contentBase: path.resolve(__dirname, settings.paths.templates),
        host: settings.devServerConfig.host(),
        port: settings.devServerConfig.port(),
        https: !!parseInt(settings.devServerConfig.https()),
        disableHostCheck: true,
        quiet: true,
        hot: true,
        open: true,
        hotOnly: true,
        overlay: true,
        stats: 'errors-only',
        watchOptions: {
            poll: !!parseInt(settings.devServerConfig.poll()),
            ignored: /node_modules/,
        },
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        // Use sane to monitor all of the templates files and sub-directories
        before: (app, server) => {
            const watcher = sane(path.join(__dirname, settings.paths.templates), {
                glob: ['**/*.html'],
                poll: !!parseInt(settings.devServerConfig.poll()),
            });
            watcher.on('change', function(filePath, root, stat) {
                console.log('  File modified:', filePath);
                server.sockWrite(server.sockets, "content-changed");
            });
        },
    };
};

// Configure Image loader
const configureImageLoader = () => {
    return {
            test: /\.(png|jpe?g|gif|svg|webp)$/i,
            exclude: path.resolve(__dirname, './src/assets/img/sprite-images'),
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]',
                    }
                }
            ]
        };
};


// Configure SVG loader
const configureSVGLoader = () => {
    return {
        test: /\.svg$/,
        include: path.resolve(__dirname, './src/assets/img/sprite-images'), // new line
        use: [
            'svg-sprite-loader',
            'svgo-loader'
        ]
    };
};


// Configure the Postcss loader
const configurePostcssLoader = () => {
        return {
            test: /\.(pcss|s?css)$/,
            use: [
                {
                    loader: 'style-loader',
                },
                // {
                //     loader: 'vue-style-loader',
                // },
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 2,
                        sourceMap: true
                    }
                },
                {
                    loader: 'resolve-url-loader'
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: true
                    }
                }
            ]
        };

};

// Development module exports
module.exports = merge(
        common,
        {
            output: {
                filename: path.join('./js', '[name].[hash].js'),
                publicPath: settings.devServerConfig.public() + '/',
            },
            mode: 'development',
            devtool: 'inline-source-map',
            devServer: configureDevServer(),
            module: {
                rules: [
                    configurePostcssLoader(),
                    configureImageLoader(),
                    configureSVGLoader(),
                ],
            },
            plugins: [
                new webpack.HotModuleReplacementPlugin(),
                new DashboardPlugin(dashboard.setData),
                new HtmlWebpackPlugin({
                    template: path.resolve(__dirname, 'src/index.html'),
                    filename: 'index.html',
                })
            ],
        }
    );
