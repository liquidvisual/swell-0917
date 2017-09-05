/*
    GOOGLE-MAP.JS - Last updated: 27.06.17
*/
//-----------------------------------------------------------------
//
//-----------------------------------------------------------------

;(function($) {
    'use strict';

    //-----------------------------------------------------------------
    // GOOGLE MAP - PREVENT SCROLL TRAP
    //-----------------------------------------------------------------

    var $googleMap = $('.lv-google-map');

    if ($googleMap.length) {

        $googleMap.click(function () {
            $googleMap.find('iframe').css('pointer-events', 'auto');
        });

        $googleMap.mouseleave(function() {
          $googleMap.find('iframe').css('pointer-events', 'none');
        });
    }

}(jQuery));

//==================================================
//
//==================================================

