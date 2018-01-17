---
layout: base__homepage
title: Homepage
permalink: /
regenerate: true
user_type: paid
---

<style>
	pre {
		height: 250px;
		overflow: auto;
		resize: vertical;
		font-size: 12px;
	}
</style>

## Installation Instructions

The source for this codebase can be found at: [https://github.com/liquidvisual/swell-0917](https://github.com/liquidvisual/swell-0917)

The compiled source which serves this page is found on the [gh-pages](https://github.com/liquidvisual/swell-0917/tree/gh-pages) branch.

This static website is built to simulate the existing environment of Swellnet, using external links and resources from the current site. Integration of new features should be relatively straight forward, since the assets (JS, CSS) are bundled and minified - and can be easily dropped in.
<br><br>

### 01. Bring /assets into Your Project

This codebase generates bundled CSS &amp; JavaScript and places it into a distributable [assets](https://github.com/liquidvisual/swell-0917/tree/gh-pages/assets) folder. For everything to work properly, first copy this folder into the root of your project.
<br><br>

### 02. Add New CSS Last

* This codebase generates a [minified.css](https://github.com/liquidvisual/swell-0917/tree/gh-pages/assets/css).
* __minified.css__ is to be placed after all previous styles in the `<head>`.
* You can link out to it directly for testing [here](https://raw.githubusercontent.com/liquidvisual/swell-0917/gh-pages/assets/css/minified.css) if you wish.
<br><br>

### 03. Add New JavaScript Last

* Copy the following block and paste it after all other scripts, before the closing `</body>`.
* This block includes a [minified.js](https://github.com/liquidvisual/swell-0917/tree/gh-pages/assets/scripts) which can also be linked out to [here](https://raw.githubusercontent.com/liquidvisual/swell-0917/gh-pages/assets/scripts/minified.js).
<br><br>

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
<br>

### 04. Install the Video Widget
* The most current code for this widget can be found [here](https://github.com/liquidvisual/swell-0917/blob/master/src/_includes/video.html).
* You'll notice there are some templating conditionals wrapping certain parts. This is to change the appearance and order of the widget depending on whether it's a Feed or a Replay.
* Substitute this syntax with your own templating language.
* Here is an example of the code for reference, though make sure to always use the first link - as things may change.
<br><br>

```
{% raw %}
<!-- VIDEO WIDGET -->
<section id="video-widget" class="mb-4">

    {% if page.url contains 'replays' or page.url == '/' %}
        <!-- DATE DROPDOWN -->
        <div class="custom-select-wrapper collapse-row-sm-only" v-if="feed">
            <date-select v-model="date"></date-select>
            <time-select v-model="selectedDateIndex" :index="selectedDateIndex" :feed="feed"></time-select>
        </div>
    {% endif %}

    <!-- VIDEO PLAYER -->
    <video-player :selected-video="selectedVideo"
                  live-stream="rtmp://streamer.swellnet.com.au/surfcams/knights.stream"
                  live-stream-image="http://static.swellnet.com.au/images/surfcams/knights.jpg"
                  live-stream-playlist="https://streamer.swellnet.com.au/surfcams/knights.stream/playlist.m3u8">
    </video-player>

    {% if page.url contains 'live' %}
        <!-- SURFCAM REPLAYS -->
        <h2 class="d-flex mb-4 mt-5"><i class="fa fa-rotate-left pr-3"></i> Surfcam Replays</h2>

        <!-- DATE DROPDOWN -->
        <div class="custom-select-wrapper collapse-row-sm-only mt-0">
            <date-select v-model="date"></date-select>
            <time-select v-model="selectedDateIndex" :index="selectedDateIndex" :feed="feed"></time-select>
        </div>
    {% endif %}

    <!-- THUMB SLIDER -->
    <thumb-slider :feed="feed" :current-index="selectedDateIndex" @select-video="selectVideo" v-if="feed" :class="{'thumbs-loading': feedLoading}"></thumb-slider>

    {% unless page.user_type == 'paid' %}
        {% include ads.html type=2 %}
    {% endunless %}

</section>
{% endraw %}
```

<br>

### 05. Install the Social Widgets
* Copy the block below and add it to the page.
* This widget uses a third-party library that has it's own templating. For things to work, it relies on two folders containing HTML to be in the root of your project.
* [social-feed-facebook/](https://github.com/liquidvisual/swell-0917/tree/gh-pages/social-feed-facebook)
* [social-feed-instagram/](https://github.com/liquidvisual/swell-0917/tree/gh-pages/social-feed-instagram)
<br><br>

```
{% raw %}
<!-- SOCIAL FEED -->
<section class="mb-5">

	<!-- FACEBOOK -->
	<div class="d-flex align-items-end mb-4">
		<h2 class="d-flex align-items-center m-0"><i class="fa fa-facebook"></i>&nbsp; Facebook</h2>
		<a target="_blank" href="https://facebook.com/swellnet/" class="anchor-link ml-auto hidden-sm-down">facebook.com/swellnet <i class="fa fa-angle-right"></i></a>
		<a target="_blank" href="https://facebook.com/swellnet/" class="anchor-link ml-auto hidden-md-up">View more <i class="fa fa-angle-right"></i></a>
	</div>

	<!-- FACEBOOK FEED -->
	<div class="social-feed-facebook-container block-grid-xs-1 block-grid-md-3"></div>

	<hr class="my-5">

	<!-- INSTAGRAM -->
	<div class="d-flex align-items-center mb-5">
		<h2 class="d-flex align-items-center m-0"><i class="fa fa-instagram"></i>&nbsp; Instagram</h2>
		<a target="_blank" href="https://instagram.com/swellnet/" class="anchor-link ml-auto hidden-sm-down">instagram.com/swellnet <i class="fa fa-angle-right"></i></a>
		<a target="_blank" href="https://instagram.com/swellnet/" class="anchor-link ml-auto hidden-md-up">View more <i class="fa fa-angle-right"></i></a>
	</div>

	<!-- INSTAGRAM FEED -->
	<div class="social-feed-instagram-container block-grid-xs-2 block-grid-md-4 block-grid-condensed-sm-down mb-4"></div>
</section>
{% endraw %}
```
<br>

### 06. Install the Header
* The header has some new components but everything can be left mostly in tact (such as the menus). Just follow the templating syntax as a guide for where everything goes.
* The header will appear differently depending on the user type (public, paid, unpaid etc)
* The source for this file is [here](https://github.com/liquidvisual/swell-0917/blob/master/src/_includes/header.html)
<br><br>

```
{% raw %}
{% assign settings = site.data.settings %}
{% assign logo = page.logo | default: "http://swellnet.com/profiles/swellnet/themes/gold/logo.png" %}

<!-- GLOBAL HEADER -->
<header id="header" class="global-header header mb-4" role="banner">
    <div class="header-container container-smooth container-fluid">

        <!-- NAVBAR TOGGLE -->
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#site-main-menu">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
        </button>

        <!-- SITE LOGO -->
        <span class="site-logo">
            <a href="/" id="logo" rel="home" title="Return to the Swellnet home page">
                <img class="img-responsive" src="{{ logo }}" alt="Swellnet logo">
            </a>
        </span>

        <!-- SITE MAIN MENU -->
        <div id="site-main-menu" class="yamm site-main-menu navbar navbar-default navbar-collapse collapse">
            <ul class="menu navbar-nav nav">
                <li class="first leaf nav-home" id="nav-home-3"><a href="/" title="Home" class="leaf-link">Home</a></li>
                <li class="leaf nav-surf-reports-and-forecasts" id="nav-surf-reports-and-forecasts-4"><a href="#" class="leaf-link">Surf Reports &amp; Forecasts</a></li>
                <li class="leaf nav-surfcams active active-trail" id="nav-surfcams-5"><a href="#" class="leaf-link active-trail">Surfcams</a></li>
                <li class="leaf nav-news" id="nav-news-6"><a href="#" class="leaf-link">News</a></li>
                <li class="leaf nav-photos" id="nav-photos-7"><a href="#" class="leaf-link">Photos</a></li>
                <li class="last leaf nav-forum" id="nav-forum-8"><a href="#" title="" class="leaf-link">Forum</a></li>

                {% if page.user_type == 'public' %}
                    <!-- PUBLIC USERS -->
                    <li class="nav-login"><a href="#">Login</a></li>
                    <li class="nav-register"><a href="#">Register</a></li>
                {% endif %}

                {% unless page.user_type == 'public' %}
                    <!-- PAID MEMBERS -->
                    <li class="nav-paid-member">
                        <ul>
                            <li><a href="#">My Report</a></li>
                            <li><a href="#">My Surfcam</a></li>
                            <li><a href="#">My Account</a></li>
                            <li><a href="#">Log Out</a></li>
                        </ul>
                    </li>
                {% endunless %}

            </ul>
        </div>

        {% unless page.user_type == 'paid' %}
            {% include ads.html type=1 %}
        {% endunless %}

    </div> <!-- /.header-container -->

    <!-- SCREEN READER ONLY -->
    <div class="sr-only lead">Australian Surf Cams, Surf Reports and Surf Forecasts</div>
</header>
{% endraw %}
```
<br>

### 07. Install the Footer
The footer has a new appearance for mobile. Copy the following block and place it immediately after the footer.
<br><br>

```
{% raw %}
<!-- OVERRIDING FOOTER (FOR MOBILE) -->
<footer class="footer footer-mobile" role="contentinfo">
    <div class="row">
        <div class="col-hack-6">
            <ul>
                <li><a href="http://swellnet.com/contact/">Contact us</a></li>
                <li><a href="http://swellnet.com/about/">About Swellnet</a></li>
                <li><a href="http://swellnet.com/privacy/">Privacy policy</a></li>
                <li><a href="http://swellnet.com/terms/">Terms and Conditions</a></li>
            </ul>
        </div>
        <div class="col-hack-6">
            <ul class="text-right">
                <li><a href="http://swellnet.com/user/">My account</a></li>
                <li><a href="http://swellnet.com/user/register/">Register</a></li>
                <li><a href="http://swellnet.com/user/password/">Forgot password</a></li>
            </ul>
        </div>
    </div>
    <div class="text-right">
        <img width="144" src="/assets/img/content/swellnet-logo-white.png" title="Swellnet">
        <p>&copy; Swellnet 2017. All rights reserved.</p>
    </div>
</footer>
{% endraw %}
```
<br>

### 08. Install the Nearest Surfcams

* On the right hand side, there are surfcam thumbnails rendered by the server.
* JQuery will pick this up, as long as the markup is the same as below.
* Make sure to substitute the templating syntax (loop) for your own and fill in the necessary image locations and location labels.
<br><br>

```
{% raw %}
<!-- NEAREST REPORTS / SURFCAMS -->
<section class="mb-5 mb-md-4">

    <h2 class="sidebar-header d-flex mb-4"><i class="fa fa-bar-chart pr-3"></i> Nearest Report / Forecast</h2>
    <a href="#" class="btn btn-cta">Middleton <i class="fa fa-angle-right"></i></a>
    <hr class="my-5">

    <!-- NEAREST SURFCAMS -->
    <h2 class="sidebar-header h3 d-flex mb-4"><i class="fa fa-video-camera pr-3"></i> Nearest Surfcams</h2>

    <!-- THUMB SLIDER -->
    <div class="thumb-slider-wrapper collapse-row-sm-only">
        <div class="thumb-slider-track">
            <div class="thumb-slider special-nearest-surfcams is-stacked-for-desktop" data-thumb-slider>

                {% for i in (1..6) %}
                    <div class="thumb-slider-item btn-tile">
                        <span class="field-content">
                            <a href="/surfcams/middleton">
                                <img class="img-responsive" src="http://static.swellnet.com.au/images/surfcams/middleton-thumb.jpg" alt="Middleton" title="Middleton">
                            </a>
                        </span>
                        <span class="field-content">
                            <a href="/surfcams/middleton">Middleton</a>
                        </span>
                        <span class="field-content">4.949165415382</span>
                    </div>
                {% endfor %}

            </div>

            <!-- SLIDER CONTROLS -->
            <button class="thumb-slider-prev-btn"><i class="fa fa-angle-left"></i></button>
            <button class="thumb-slider-next-btn"><i class="fa fa-angle-right"></i></button>
        </div>
    </div>
</section>
{% endraw %}
```

{% comment %}
* user_type.public vairable controls what you see
* body has theme - theme-public, theme-paid etc -> for header?
* theme is just for adverts right now, absolute spacing
* comments and forums have new headers - all other code is the same


* latest news is the same
* have changed @include CSS to links - performance boost
* navigation doesn't include the dropdown - so copy existing code
* some bootstrap are included and parts of the grid, but most don't work
* this.dateFormatted - getting API after midnight returns empty, can only access after 6am?
{% endcomment %}

