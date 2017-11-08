---
layout: base__homepage
title: Homepage
permalink: /
regenerate: true
user_type: paid
---

## Installation Instructions

The codebase for this website can be found at: <a href="https://github.com/liquidvisual/swell-0917">https://github.com/liquidvisual/swell-0917</a>

This static website is built to simulate the existing environment of Swellnet, using external links and resources from the current site. Integration of new features should be relatively straight forward, since the assets (JS, CSS) are bundled and minified - and can be easily dropped in.
<br><br>

<h3>Step 01. Bring /assets into Your Environment</h3>

This codebase generates bundled CSS &amp; JavaScript and places it into a distributable [assets](https://github.com/liquidvisual/swell-0917/tree/gh-pages/assets) folder. For everything to work properly, first copy this folder into the root of your environment.
<br><br>

<h3>Step 01. Add New CSS Last</h3>

* This codebase generates a [minified.css](https://github.com/liquidvisual/swell-0917/tree/gh-pages/assets/css)
* __minified.css__ is to be placed after all previous styles in the `<head>`
* You can link out to it directly for testing [here](https://github.com/liquidvisual/swell-0917/blob/gh-pages/assets/css/minified.css) if you wish
<br><br>

<h3>Step 02. Add New JavaScript Last</h3>

* Copy the following block and paste it after all other scripts, before the closing `</body>`
* This block includes a [minified.js](https://github.com/liquidvisual/swell-0917/tree/gh-pages/assets/scripts) which can also be linked out to [here](https://raw.githubusercontent.com/liquidvisual/swell-0917/gh-pages/assets/scripts/minified.js)

<style>
	pre {
		height: 250px;
		overflow: auto;
		resize: vertical;
		font-size: 12px;
	}
</style>

```
<!-- *************************** LIQUIDVISUAL ADDED: 08.11.17 *************************** -->

<!--[if lte IE 9]>
<div class="lv-alert-bar">
    <p>You're using an outdated browser. Please <a href="http://outdatedbrowser.com">upgrade your browser</a> to improve your experience.</p>
    <span class="lv-alert-bar-close-btn">&times;</span>
    <div class="lv-blackout"></div>
</div>
<![endif]-->

<!-- **** JAVASCRIPT **** -->

<script type="/assets/scripts/minified.js"></script>

<script>
    $(window).on('load', function (){

        // FACEBOOK
        $('.social-feed-facebook-container').each(function(){
            var $this = $(this);
            $this.socialfeed({
                facebook: {
                    accounts: ['@swellnet'],
                    limit: 3,
                    access_token: '1142564202455221|3a2db052ca1e71a576329b99b7d55a5b'
                },
                // GENERAL SETTINGS
                length: 200,
                show_media: true,
                template: "/social-feed-facebook/",

                // When all the posts are collected and displayed - this function is evoked
                callback: function () {
                    setTimeout(function(){
                      $('.social-feed-facebook-container').masonry();

                        setTimeout(function(){
                            $('.social-feed-facebook-container').masonry();
                        }, 800);
                    }, 800);
                }
            });
        });

        // INSTAGRAM
        $('.social-feed-instagram-container').each(function(){
            var $this = $(this);
            $this.socialfeed({
                instagram: {
                    accounts: ['@swellnet'],
                    limit: 4,
                    //client_id: '88b4730e0e2c4b2f8a09a6184af2e218',
                    //access_token: ''
                    client_id: 'aa2ef3e8118541c0b7c372cfd81e752b',
                    access_token: '3178942332.e029fea.ab1887d8d8024dd69d8b1dafbbfa773b'
                },

                // GENERAL SETTINGS
                length: 200,
                show_media: true,
                template: "/social-feed-instagram/",
            });
        });
    });
</script>

<!-- NO JAVASCRIPT WARNING -->
<noscript>
    <div class="lv-alert-bar">
        <p>Your browser has Javascript disabled. Some features may be limited.</p>
    </div>
</noscript>

<!-- *************************** / LIQUIDVISUAL ADDED: 08.11.17 *************************** -->
```
<br><br>


* user_type.public vairable controls what you see
* body has theme - theme-public, theme-paid etc -> for header?
* theme is just for adverts right now, absolute spacing
* comments and forums have new headers - all other code is the same


* latest news is the same
* have changed @include CSS to links - performance boost
* navigation doesn't include the dropdown - so copy existing code
* some bootstrap are included and parts of the grid, but most don't work
* this.dateFormatted - getting API after midnight returns empty, can only access after 6am?

