/*
    VIDEO-LOADER.JS - Last updated: 21.09.17
*/
//-----------------------------------------------------------------
// VARIABLES
//-----------------------------------------------------------------

//var $dateSelector = $('[date-selector]');

// PLAYER DEFAULTS
var player_conf = {
	autostart: true,
	primary: 'html5',
	fallback: true,
	androidhls: true,
	width: '100%',
    height: 421,
    logo: {
        file: 'profiles/swellnet/modules/features/swellnet_surfcam/assets/logo_transparent_overlay.png'
    },
    stagevideo: false,
    events: {
        onReady: function(e) {
            window.swellnetElapsedTime = 0;
        },
        onTime: function(e) {
            if ((window.swellnetElapsedTime + e.position) >= '300') {
                this.stop();
            }
        },
        onPause: function(e) {
            window.swellnetElapsedTime += this.getPosition();
        }
    }
};

//-----------------------------------------------------------------
// INIT
//-----------------------------------------------------------------

//getDates();
playVideo('rtmp://streamer.swellnet.com.au/surfcams/knights.stream',
          'https://streamer.swellnet.com.au/surfcams/knights.stream/playlist.m3u8',
          'http://static.swellnet.com.au/images/surfcams/knights.jpg');

//-----------------------------------------------------------------
//
//-----------------------------------------------------------------

// function getDates(){
// 	// $dateSelector.load('http://ajax-endpoint', function(){
// 		// populate selector
// 	// });
// }

//-----------------------------------------------------------------
// SELECT DATE
//-----------------------------------------------------------------

// function selectDate(){
// 	// $dateSelector.on('change', function(){
// 		// load latest 100 from that date
// 		// find closest instance of thumbnails
// 		// render them in
// 	// });
// }

//-----------------------------------------------------------------
// LOAD REPLAY THUMBS
//-----------------------------------------------------------------

// function loadReplayThumbs(){
// 	// if replay thumbs is 'data-replay-mode' => find accompanying video player and load it into JPlayer
// 	// else populate the thumbs with links instead
// }

//-----------------------------------------------------------------
// PLAY VIDEO
//-----------------------------------------------------------------

function playVideo(stream, playlist, image) {
	var newStream = {
	    sources: [
	        {file: stream   },   // 'rtmp://streamer.swellnet.com.au/surfcams/knights.stream'
	        {file: playlist }, // https://streamer.swellnet.com.au/surfcams/knights.stream/playlist.m3u8
	    ],
	    image: image,         // 'http://static.swellnet.com.au/images/surfcams/knights.jpg'
	};
	jQuery.extend(player_conf, newStream);
	jwplayer('video').setup(player_conf);
}

//-----------------------------------------------------------------
//
//-----------------------------------------------------------------
//==================================================
//
//==================================================