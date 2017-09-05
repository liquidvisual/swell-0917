/*
    SEARCH.JS - Last updated: 03.07.17
*/
//-----------------------------------------------------------------
// VARIABLES
//-----------------------------------------------------------------
//-----------------------------------------------------------------
// SEARCH TRIGGER
//-----------------------------------------------------------------

$('[data-search-trigger]').click(function(event){

    var $search = $('[data-search]');
    //var searchIsHidden = $search.hasClass('is-hidden');
    $search.removeClass('is-hidden');

    $(document).on('scroll', function(){
        $search.addClass('is-hidden');
        // automatically close the keyboard on iOS
        document.activeElement.blur();
    });

    return false;
});

//==============================================
// LAUNCH MANAGE ON KEYPRESS
//==============================================

$('[data-search] .close').on('click', function(){
    $('[data-search]').addClass('is-hidden');
    // automatically close the keyboard on iOS
    document.activeElement.blur();
});

//==================================================
//
//==================================================