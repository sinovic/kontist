module.exports = {
    plugins: [
        require('postcss-import')({
            plugins: [
                require('stylelint')
            ]
        }),
        require('precss')(),
        require('tailwindcss')('./tailwind.config.js'),
        require('postcss-preset-env')({
            autoprefixer: { grid: true },
            features: {
                'nesting-rules': true
            }
        })
    ]
};
