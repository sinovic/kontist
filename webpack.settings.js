// webpack.settings.js - webpack settings config

// node modules
require('dotenv').config();

// Webpack settings exports
// noinspection WebpackConfigHighlighting
module.exports = {
    name: "Example Project",
    copyright: "Example Company, Inc.",
    paths: {
        src: {
            base: "./src/",
            css: "./src/assets/css/",
            js: "./src/assets/js/"
        },
        dist: {
            base: "./dist/assets/",
            clean: [
                "./img",
                "./critical",
                "./css",
                "./js"
            ]
        },
        templates: "./src/"
    },
    urls: {
        live: "http://example.com/",
        local: "http://example.test/",
        critical: "http://kontist.test/",
        publicPath: () => process.env.PUBLIC_PATH || "./assets/", //./dist/
    },
    vars: {
        cssName: "styles"
    },
    entries: {
        "app": "app.js"
    },
    criticalCssConfig: {
        base: "./dist/",
        suffix: "_critical.min.css",
        criticalHeight: 1200,
        criticalWidth: 900,
        ampPrefix: "amp_",
        ampCriticalHeight: 19200,
        ampCriticalWidth: 600,
        pages: [
            {
                url: "/",
                template: "index"
            }
        ]
    },
    devServerConfig: {
        public: () => process.env.DEVSERVER_PUBLIC || "http://localhost:8080",
        host: () => process.env.DEVSERVER_HOST || "localhost",
        poll: () => process.env.DEVSERVER_POLL || false,
        port: () => process.env.DEVSERVER_PORT || 8080,
        https: () => process.env.DEVSERVER_HTTPS || false,
    },
    manifestConfig: {
        basePath: ""
    },
    purgeCssConfig: {
        paths: [
            "./src/**/*.{twig,html}",
            "./src/vue/**/*.{vue,html}"
        ],
        whitelist: [
            "./src/assets/css/components/**/*.{css,pcss}"
        ],
        whitelistPatterns: [],
        extensions: [
            "html",
            "js",
            "twig",
            "vue"
        ]
    },
    createSymlinkConfig: [
        {
            origin: "assets/img/favicon/favicon.ico",
            symlink: "../favicon.ico"
        }
    ],
    // copyWebpackConfig: [
    //     {
    //         from: "./src/js/workbox-catch-handler.js",
    //         to: "js/[name].[ext]"
    //     }
    // ],
    // saveRemoteFileConfig: [
    //     {
    //         url: "https://www.google-analytics.com/analytics.js",
    //         filepath: "js/analytics.js"
    //     }
    // ],

    // webappConfig: {
    //     logo: "./src/img/favicon-src.png",
    //     prefix: "img/favicons/"
    // },
    // workboxConfig: {
    //     swDest: "../sw.js",
    //     precacheManifestFilename: "js/precache-manifest.[manifestHash].js",
    //     importScripts: [
    //         "/dist/workbox-catch-handler.js"
    //     ],
    //     exclude: [
    //         /\.(png|jpe?g|gif|svg|webp)$/i,
    //         /\.map$/,
    //         /^manifest.*\\.js(?:on)?$/,
    //     ],
    //     globDirectory: "./web/",
    //     globPatterns: [
    //         "offline.html",
    //         "offline.svg"
    //     ],
    //     offlineGoogleAnalytics: true,
    //     runtimeCaching: [
    //         {
    //             urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/,
    //             handler: "cacheFirst",
    //             options: {
    //                 cacheName: "images",
    //                 expiration: {
    //                     maxEntries: 20
    //                 }
    //             }
    //         }
    //     ]
    // }
};
