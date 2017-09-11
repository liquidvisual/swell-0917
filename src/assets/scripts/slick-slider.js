/*
    SLICK-SLIDER.JS - Last updated: 11.08.17
*/
//-----------------------------------------------------------------
// VARIABLES
//-----------------------------------------------------------------
//-----------------------------------------------------------------
// INIT
//-----------------------------------------------------------------

launchSlider();

//-----------------------------------------------------------------
// ON RESIZE
//-----------------------------------------------------------------

$(window).on('resize orientationchange', function() {
	$('[data-thumb-slider]').slick('resize');
});

//-----------------------------------------------------------------
// LAUNCH SLIDER
//-----------------------------------------------------------------

function launchSlider() {
	$('[data-thumb-slider]').each(function(){

		//==================================================
		// VARS
		//==================================================

		var $this = $(this);
		var isStackedForDesktop = $this.hasClass('is-stacked-for-desktop');
		var $prevArrow = $this.parent().find('.thumb-slider-prev-btn');
		var $nextArrow = $this.parent().find('.thumb-slider-next-btn');

		//==================================================
		// SLICK
		//==================================================

		$this.slick({
			arrow: true,
			autoplay: false,
			centerMode: false,
			infinite: true,
			mobileFirst: true,
			nextArrow: $nextArrow,
			prevArrow: $prevArrow,
			pause: 5000,
			// slide: 'div',
			slidesToShow: 3,
			slidesToScroll: 3,
			speed: 800,
			variableWidth: true,
			// variableHeight: true,
			responsive: [
			{
				breakpoint: 960,
				settings: isStackedForDesktop ? 'unslick' : {
					slidesToShow: 5,
					slidesToScroll: 5,
				}
			}
			]
		});
	});
}

//-----------------------------------------------------------------
//
//-----------------------------------------------------------------

// $('.card-slider').slick('unslick'); // destroy all

//==================================================
//
//==================================================