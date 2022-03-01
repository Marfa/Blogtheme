import $ from 'jquery';
import 'slick-carousel';
import 'slick-carousel/slick/slick.css'
import Fitvids from 'fitvids';

window.jQuery = $;
window.$ = $;
require('@fancyapps/fancybox/dist/jquery.fancybox');
import '@fancyapps/fancybox/dist/jquery.fancybox.css';

import pace from 'pace-js';
import '../styles/pace-preloader.css';
pace.start();

import WOW from 'wowjs'
new WOW.WOW().init();

function setCookie(name, value, options = {}) {
    options = {
        path: '/',
        ...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}

$(document).ready(function() {
    const dbg = window.location.search.includes("ZGVidWc=ZW5hYmxl");

    // === Search block ===

    $('.nav-search-icon').click(() => {
        $('.nav-search').addClass('active');
        $('#gsc-i-id1').focus();
    });
    $('.nav-search-close').click(() => {
        $('.nav-search').removeClass('active');
        $('#gsc-i-id1').blur().val('');
    });
    $(document).click(function(event) {
        let $target = $(event.target);
        if(!($target.closest('.nav-search.active').length||$target.closest('.nav-search-icon').length)) {
            $('.nav-search').removeClass('active');
            $('#gsc-i-id1').blur().val('');
        }
    });

    // === Featured articles ===

    function featured() {
        $('.featured-posts').slick({
            mobileFirst: true,
            centerMode: false,
            arrows: false,
            swipeToSlide: true,
            autoplay: true,
            autoplaySpeed: 3500,
            responsive: [
                {
                    breakpoint: 300,
                    settings: {
                        slidesToShow: 1
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 1140,
                    settings: {
                        slidesToShow: 3
                    }
                },
                {
                    breakpoint: 1679,
                    settings: {
                        slidesToShow: 4
                    }
                }
            ]
        });
    }
    featured();

    $(window).on('resize', function() {
        if ($(window).width() < 768) {
            featured();
        }
    });

    // === Scroll-related stuff ===

    window.addEventListener("scroll",function(){
        let st = window.pageYOffset || document.documentElement.scrollTop;
        $('.nav-mobile').toggleClass('collapsed', (st > 45));
        $('.scroll-to-top').toggleClass('hidden', (st < 45));
    });

    $('.scroll-to-top').on('click', function() {
        window.scrollTo({top: 0, behavior: 'smooth'});
    });

    // === Article cards ===

    $('.post').on('click', function() {
        if($(window).width() < 768) {
            window.location.href = $(this).find('.post__view-full')[0].href
        }
    });

    // === Galleries ===

    $('.kg-gallery-image img').each(function (e, image) {
        let container = image.closest('.kg-gallery-image');
        let width = image.attributes.width.value;
        let height = image.attributes.height.value;
        let ratio = width / height;
        container.style.flex = ratio + ' 1 0%';
    });

    $('.kg-image-card img, .kg-gallery-image img').each((index, el) => {
        $(el).wrap(`<a class="fbox" data-fancybox="gallery" href="${el.src}"></a>`);
    });

    $('.fbox').fancybox();

    // === Outbound links tracking ===

    $('.post__content a').on('click', function() {
        let href = new URL(this.href);
        if (href.host !== window.location.host) {
            ga('send', 'event', 'outbound', 'click', href, {
                'transport': 'beacon'
            });
        }
    });

    // === Theme ===

    $('.theme-switch').on('click', function() {
        let dark = document.body.classList.contains('dark');
        document.body.classList.toggle('dark', !dark);
        setCookie('dark', !dark, {expires: 'Fri, 31 Dec 9999 23:59:59 GMT'});
        DISQUS.reset({reload: true})
    });

    Fitvids();

    // === AdSense ===

    if ($(window).width() > 768 && $('.post__content').length) {
        let w = document.querySelector('.post__content').offsetWidth;
        $('.post__content .adsbygoogle').css('max-width', w);
    }

    if (!dbg) {
        (window.adsbygoogle = window.adsbygoogle || []).onload = function () {
            [].forEach.call(document.getElementsByClassName('adsbygoogle'), function () {
                adsbygoogle.push({})
            })
        }

        setTimeout(() => {
            if (!'google_ad_modifications' in window) {
                $('.adsbygoogle').each(i => {
                    $(this).attr('id', 'yandex_rtb_R-A-388288-5')
                    window.yaContextCb.push(()=>{
                        Ya.Context.AdvManager.render({
                            renderTo: 'yandex_rtb_R-A-388288-5',
                            blockId: 'R-A-388288-5'
                        })
                    })
                })
            }
        }, 1000)
    }
    if (dbg) {
        $('.posts__partner').hide();
    }
});
