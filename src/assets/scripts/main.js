/*
    MAIN.JS - Last updated: 27.06.17
*/
//-----------------------------------------------------------------
// VARIABLES
//-----------------------------------------------------------------
//-----------------------------------------------------------------
// WINDOW LOAD
//-----------------------------------------------------------------

$(window).on('load', function() {
    $('html').addClass('has-loaded');
});

//-----------------------------------------------------------------
// SCROLL TO
//-----------------------------------------------------------------

$('a[href*="#"]:not([href="#"], [href="#sitemap"])').click(function() {
    var id = $(this).attr('href');
    var endPos = $(id);

    if (endPos.length) {
        $.scrollTo(endPos.offset().top, 500);
        return false;
    }
});

// $('a[href*="#"]:not([href="#"])').click(function() {
//     if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
//         var target = $(this.hash);
//         target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
//         if (target.length) {
//             $.scrollTo(target.offset().top, 500);
//             return false;
//         }
//     }
// });

//-----------------------------------------------------------------
// OPEN SITEMAP (OPTIONAL)
//-----------------------------------------------------------------

if ($('a[href="#sitemap"]').length) {
    $('a[href="#sitemap"]').click(function() {
        var id = $(this).attr('href');
        var endPos = $(id);
        $('.fa-angle-down').toggleClass('is-active');
        setTimeout(function(){
            $.scrollTo(endPos.offset().top, 300);
        }, 300);
    });
}

//-----------------------------------------------------------------
// HEADROOM.js
//-----------------------------------------------------------------

$(".global-header").headroom({
    // vertical offset in px before element is first unpinned
    offset : 60,
    // scroll tolerance in px before state changes
    tolerance : 0,
    // or you can specify tolerance individually for up/down scroll
    tolerance : {
        up : 5,
        down : 0
    },
    // css classes to apply
    classes : {
        // when element is initialised
        initial : "headroom",
        // when scrolling up
        pinned : "headroom--pinned",
        // when scrolling down
        unpinned : "headroom--unpinned",
        // when above offset
        top : "headroom--top",
        // when below offset
        notTop : "headroom--not-top",
        // when at bottom of scoll area
        bottom : "headroom--bottom",
        // when not at bottom of scroll area
        notBottom : "headroom--not-bottom"
    },
    // element to listen to scroll events on, defaults to `window`
    // scroller : someElement,
    // callback when pinned, `this` is headroom object
    onPin : function() {},
    // callback when unpinned, `this` is headroom object
    onUnpin : function() {},
    // callback when above offset, `this` is headroom object
    onTop : function() {},
    // callback when below offset, `this` is headroom object
    onNotTop : function() {},
    // callback when at bottom of page, `this` is headroom object
    onBottom : function() {},
    // callback when moving away from bottom of page, `this` is headroom object
    onNotBottom : function() {}
});

//==================================================
//
//==================================================