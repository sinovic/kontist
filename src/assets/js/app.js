import styles from '../css/app.pcss';
import $ from 'jquery';
import LazyLoad from 'vanilla-lazyload';

// import all images needed
function requireAll(r) {
    r.keys().forEach(r);
}
requireAll(require.context('../img/sprite-images/', true, /\.svg$/));
requireAll(require.context('../img/', false, /\.(png|jpe?g|gif|svg|webp)$/i));

// change button background color on scroll
$(window).on('scroll', function() {
    let y_scroll_pos = window.pageYOffset;
    let scroll_pos_init = 0;

    if(y_scroll_pos === scroll_pos_init) {
        $('#cta').removeClass('bg-plump-purple text-white').addClass('hover:bg-grey-light');
    } else {
        $('#cta').removeClass('hover:bg-grey-light').addClass('bg-plump-purple text-white');
    }
});

// lazy loading images
new LazyLoad({
    elements_selector: ".lozad",
    threshold: 100,
});

console.log('Hello from App.js!!!');




