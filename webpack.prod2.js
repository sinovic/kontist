// node modules
const git = require('git-rev-sync');
const glob = require('glob-all');
const merge = require('webpack-merge');
const moment = require('moment');
const path = require('path');
const webpack = require('webpack');

// webpack plugins
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CreateSymlinkPlugin = require('create-symlink-webpack-plugin');
const CriticalCssPlugin = require('critical-css-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const SaveRemoteFilePlugin = require('save-remote-file-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WhitelisterPlugin = require('purgecss-whitelister');

const Critters = require('critters-webpack-plugin');
const HtmlCriticalWebpackPlugin = require("html-critical-webpack-plugin");

// config files
const common = require('./webpack.common.js');
const pkg = require('./package.json');
const settings = require('./webpack.settings.js');

// Custom PurgeCSS extractor for Tailwind that allows special characters in
// class names.
//
// https://github.com/FullHuman/purgecss#extractor
class TailwindExtractor {
    static extract(content) {
        return content.match(/[A-Za-z0-9-_:\/]+/g) || [];
    }
}

// Configure file banner
// const configureBanner = () => {
//     return {
//         banner: [
//             '/*!',
//             ' * @project        ' + settings.name,
//             ' * @name           ' + '[filebase]',
//             ' * @author         ' + pkg.author.name,
//             ' * @build          ' + moment().format('llll') + ' ET',
//             ' * @release        ' + git.long() + ' [' + git.branch() + ']',
//             ' * @copyright      Copyright (c) ' + moment().format('YYYY') + ' ' + settings.copyright,
//             ' *',
//             ' */',
//             ''
//         ].join('\n'),
//         raw: true
//     };
// };

// Configure Bundle Analyzer
// const configureBundleAnalyzer = () => {
//     return {
//         analyzerMode: 'static',
//         reportFilename: 'report.html',
//     };
// };

// Configure Critical CSS
const configureCriticalCss = () => {
    // return (settings.criticalCssConfig.pages.map((row) => {
    //         const criticalSrc = settings.urls.critical + row.url;
    //         const criticalDest = settings.criticalCssConfig.base + row.template + settings.criticalCssConfig.suffix;
    //         let criticalWidth = settings.criticalCssConfig.criticalWidth;
    //         let criticalHeight = settings.criticalCssConfig.criticalHeight;
    //         // Handle Google AMP templates
    //         if (row.template.indexOf(settings.criticalCssConfig.ampPrefix) !== -1) {
    //             criticalWidth = settings.criticalCssConfig.ampCriticalWidth;
    //             criticalHeight = settings.criticalCssConfig.ampCriticalHeight;
    //         }
    //         console.log("source: " + criticalSrc + " dest: " + criticalDest);
    //         return new CriticalCssPlugin({
    //             base: './',
    //             src: 'index.html',
    //             dest: 'index.html',
    //             extract: false,
    //             inline: false,
    //             minify: true,
    //             width: criticalWidth,
    //             height: criticalHeight,
    //         })
    //     })
    // );
};


// Configure Critical CSS


// Configure Clean webpack
const configureCleanWebpack = () => {
    return {
        root: path.resolve(__dirname, settings.paths.dist.base),
        verbose: true,
        dry: false
    };
};

// Configure Html webpack
const configureHtml = () => {
    return {
        filename: 'indexi.html',
        template: './templates/index.html',
        chunks: ['app']
    };
};

// Configure Image loader
const configureImageLoader = () => {
    return {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        exclude: path.resolve(__dirname, './src/img/sprite-images'),
        use: [
            {
                loader: 'file-loader',
                options: {
                    name: 'img/[name].[ext]',
                },
            },
            {
                loader: 'img-loader',
                options: {
                    plugins: [
                        require('imagemin-gifsicle')({
                            interlaced: true,
                        }),
                        require('imagemin-mozjpeg')({
                            progressive: true,
                            arithmetic: false,
                        }),
                        require('imagemin-optipng')({
                            optimizationLevel: 5,
                        }),
                        require('imagemin-svgo')({
                            plugins: [
                                {convertPathData: false},
                            ]
                        }),
                    ]
                }
            }
        ]
    };
};

// Configure SVG loader
const configureSVGLoader = () => {
    return {
        test: /\.svg$/,
        include: path.resolve(__dirname, './src/img/sprite-images'), // new line
        use: [
            'svg-sprite-loader',
            'svgo-loader'
        ]
    };
};

// Configure optimization
const configureOptimization = () => {
    return {
        splitChunks: {
            cacheGroups: {
                default: false,
                common: false,
                styles: {
                    name: settings.vars.cssName,
                    test: /\.(pcss|css|js)$/,
                    chunks: 'all',
                    enforce: true
                }
            }
        },
        minimizer: [
            new TerserPlugin(
                configureTerser()
            ),
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    map: {
                        inline: false,
                        annotation: true,
                    },
                    safe: true,
                    discardComments: true
                },
            })
        ]
    };
};

// Configure Postcss loader
const configurePostcssLoader = () => {
    return {
        test: /\.(pcss|s?css)$/,
        use: [
            MiniCssExtractPlugin.loader,
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

// Configure PurgeCSS
const configurePurgeCss = () => {
    let paths = [];
    // Configure whitelist paths
    for (const [key, value] of Object.entries(settings.purgeCssConfig.paths)) {
        paths.push(path.join(__dirname, value));
    }

    return {
        paths: glob.sync(paths),
        whitelist: WhitelisterPlugin(settings.purgeCssConfig.whitelist),
        whitelistPatterns: settings.purgeCssConfig.whitelistPatterns,
        extractors: [
            {
                extractor: TailwindExtractor,
                extensions: settings.purgeCssConfig.extensions
            }
        ]
    };
};

// Configure terser
const configureTerser = () => {
    return {
        cache: true,
        parallel: true,
        sourceMap: true
    };
};

// Production module exports
module.exports =
    merge(
        common,
        {
            output: {
                filename: path.join('./js', '[name].[chunkhash].js'),
            },
            mode: 'production',
            devtool: 'source-map',
            // optimization: configureOptimization(),
            module: {
                rules: [
                    configurePostcssLoader(),
                    configureImageLoader(),
                    configureSVGLoader(),
                ],
            },
            plugins: [
                new CleanWebpackPlugin(settings.paths.dist.clean,
                    configureCleanWebpack()
                ),
                new ImageminWebpWebpackPlugin(),
                new HtmlWebpackPlugin(
                    configureHtml()
                ),
                new MiniCssExtractPlugin({
                    path: path.resolve(__dirname, settings.paths.dist.base),
                    filename: path.join('./css', '[name].[chunkhash].css'),
                }),
                new PurgecssPlugin(
                    configurePurgeCss()
                ),
                // new HtmlCriticalWebpackPlugin({
                //     base: path.resolve(__dirname, 'dist'),
                //     src: 'index.html',
                //     dest: 'criticalIndex.html',
                //     inline: true,
                //     minify: true,
                //     extract: true,
                //     width: 1200,
                //     height: 900,
                //     penthouse: {
                //         blockJSRequests: false,
                //     }
                // }),
                // new webpack.BannerPlugin(
                //     configureBanner()
                // ),
                new webpack.optimize.ModuleConcatenationPlugin(),
                // new CreateSymlinkPlugin(
                //     settings.createSymlinkConfig,
                //     true
                // ),
                // new SaveRemoteFilePlugin(
                //     settings.saveRemoteFileConfig
                // ),
                // new BundleAnalyzerPlugin(
                //     configureBundleAnalyzer(),
                // ),
            ]
            //     .concat(
            //     configureCriticalCss()
            // )
        }
    );
