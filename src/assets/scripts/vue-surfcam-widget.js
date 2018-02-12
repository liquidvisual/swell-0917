/*
    VUE-SURFCAM-WIDGET.JS
    updated: 09.02.18

    DEPENDENCIES
        https://unpkg.com/vue/dist/vue.js
        https://unpkg.com/axios/dist/axios.min.js
        https://unpkg.com/flickity@2/dist/flickity.pkgd.min.js
*/

//-----------------------------------------------------------------
// DATE LOGGING
//-----------------------------------------------------------------

const LOGGING_ENABLED = false; // disable on prod

function log(item){
    if (LOGGING_ENABLED) {
        console.log(item);
    }
}

Vue.config.productionTip = false;

//-----------------------------------------------------------------
// EVENT BUS
//-----------------------------------------------------------------

const bus = new Vue();

//-----------------------------------------------------------------
// UTILITY MIXINS
//-----------------------------------------------------------------

var utilities = {
    methods: {
        formatTime(time){
            return moment(time).format('hh:mma');
        }
    }
}
//-----------------------------------------------------------------
// DATE SELECT
//-----------------------------------------------------------------

Vue.component('date-select', {
    props: [
        'is-Loading',
    ],
    template: `
        <div class="custom-select">
            <select v-model="date" @change="broadcast">
                <option v-for="(item, index) in lastSevenDays" :key="index" :value="item" v-text="item.title"></option>
            </select>

            <i class="fa fa-caret-down"></i>
            <i class="fa fa-calendar-o"></i>

            <!-- LOADER -->
            <transition name="special-fade-in">
                <i v-if="isLoading" class="fa-li fa fa-refresh fa-spin"></i>
            </transition>
        </div>
    `,
    data() {
        return {
            // date: {},
            lastSevenDays: [],
        }
    },
    created() {
        var today = new Date();
        this.lastSevenDays = this.getDates(today, 6);
        this.date = this.lastSevenDays[0]; // set initial option as selected
    },
    mounted(){
        bus.$on('setDate', this.setDate);
    },
    methods: {
        //==================================================
        // broadcast selected date
        //==================================================

        broadcast(){
            this.$emit('input', this.date);
        },
        //==================================================
        // SET SET (ROLLBACK)
        //==================================================

        setDate(index){
            // var d = new Date();
            // var yesterday = d.setDate(d.getDate()-1);
            // this.date = { timeStamp: yesterday };
            // this.date = this.lastSevenDays[1]; // set initial option as selected

            // allow manual roll back of day without user input
            this.date = this.lastSevenDays[index];
            this.$emit('input', this.date);
        },
        //==================================================
        // getDates
        //==================================================

        getDates(startDate, totalDays){

            var dates_arr = [];

            for (var i = 0; i <= totalDays; i++) {

                var date_obj = {};
                var currentDate = new Date();
                var timeStamp = currentDate.setDate(startDate.getDate() - i);
                var dateStr = this.dayAsString(currentDate.getDay());
                    dateStr += ", ";
                    dateStr += currentDate.getDate();
                    dateStr += " ";
                    dateStr += this.monthAsString(currentDate.getMonth());
                    dateStr += " ";
                    dateStr += currentDate.getFullYear();

                date_obj.title = dateStr;
                date_obj.timeStamp = timeStamp;

                dates_arr.push(date_obj);
            }
            return dates_arr;
        },
        //==================================================
        // UTILITY: monthAsString
        //==================================================

        monthAsString(monthIndex) {
            var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            return month[monthIndex];
        },
        //==================================================
        // UTILITY: dayAsString
        //==================================================

        dayAsString(dayIndex) {
            var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return weekdays[dayIndex];
        }
    }
});
//-----------------------------------------------------------------
// TIME SELECT
//-----------------------------------------------------------------

Vue.component('time-select', {
    props: {
        feed: {},
        isLoading: {},
        index: Number
    },
    template: `
        <div class="custom-select">
            <select v-if="feed" v-model="selectedTimeIndex" @change="broadcast" :disabled="isLoading" :style="isLoading ? {cursor: 'progress'} : {}">
                <option v-for="(item, index) in feed" :key="index" :value="index" v-text="formatTime(item.start_local)"></option>
            </select>

            <!-- FEED UNAVAILABLE -->
            <select v-if="!feed">
                <option>Replays Unavailable</option>
            </select>

            <i class="fa fa-caret-down"></i>
            <i v-if="!feed" class="fa fa-ban"></i>
            <i v-if="feed" class="fa fa-clock-o"></i>
        </div>
    `,

    data() {
        return {
            selectedTimeIndex: null,
        }
    },
    watch: {
        index(){
            this.selectedTimeIndex = this.index; // OUTSIDE > IN: change <select> (model) to this index value from the outside
        }
    },

    mixins: [utilities],

    methods: {
        broadcast(){
            this.$emit('input', this.selectedTimeIndex); // INSIDE > OUT: send value back out to widget
        }
    }
});
//-----------------------------------------------------------------
// VIDEO PLAYER
//
// 1. component will either load video stream via selectedVideo (API)
// 2. OR component will load stream through props set on the template
//-----------------------------------------------------------------

Vue.component('video-player', {
    template: `
        <div id="video"></div>
    `,
    data() {
        return {
            playerInstance: null,
        }
    },

    mounted() {

        // WIDGET CALLS THIS
        bus.$on('loadVideo', this.loadVideo);
        bus.$on('initPlayer', this.initPlayer);
    },

    beforeDestroy() {
        this.playerInstance.remove();
    },

    methods: {
        //-----------------------------------------------------------------
        // INIT
        // https://support.jwplayer.com/customer/portal/articles/1480872
        // https://developer.jwplayer.com/jw-player/docs/javascript-api-reference/#jwplayernext
        //-----------------------------------------------------------------

        initPlayer(command) {

            log(':: initPlayer() ::');

            log('LIMITED DURATION: '+(command == 'limitDuration'));

            var self = this; // used for onTime

            this.playerInstance = jwplayer('video');

            //==================================================
            // CONFIG
            //==================================================

            var player_conf = {
                autostart: true,
                primary: 'html5',
                fallback: true,
                file: '.mp4', //stream ? stream : '.mp4',  // TOTAL FLUKE, halleljulah, player fails without this unless legit file
                image: '.jpg', //image ? image : '.jpg', // ^ as above
                // playlist: '',
                androidhls: true,
                width: '100%',
                height: 421,
                repeat: true,
                stagevideo: false,
                events: {
                    onReady(e) {
                        window.swellnetElapsedTime = 0;
                    },
                    onTime(e) {
                        if (command == 'limitDuration') {
                            // log('LIVE Video Timer Started - ends vid at 300s');
                            if ((window.swellnetElapsedTime + e.position) >= '300') {
                                this.stop();
                            }
                        }
                    },
                    onPause(e) {
                        window.swellnetElapsedTime += this.getPosition();
                    }
                }
            }
            //==================================================
            // SETUP GO!
            //==================================================

            log('Video Player finished setting up')
            this.playerInstance.setup(player_conf);
        },

        //-----------------------------------------------------------------
        // LOAD VIDEO
        //-----------------------------------------------------------------

        loadVideo(video) {
            log(':: loadVideo() ::');

            this.playerInstance.load([{
                file: video.stream,
                image: video.image,
                // playlist: video.playlist
            }]).play();
        }
    }
});
//-----------------------------------------------------------------
// THUMB SLIDER
// bg-lazyLoad: https://github.com/metafizzy/flickity/issues/173
// installed separately: https://github.com/metafizzy/flickity-bg-lazyload#install
// Placed onto ON: @click.prevent="selectTimeIndex(index)"
//-----------------------------------------------------------------

Vue.component('thumb-slider', {
    props: {
        feed: {
            // type: Array,
            required: true,
            default: []
        },
        isLoading: Boolean,
        currentIndex: Number, // only the time select can change this
    },
    template: `
        <div class="thumb-slider-wrapper collapse-row-sm-only" :style="isLoading ? {opacity: 0.2} : {}">
            <div class="thumb-slider-track">

                <!-- VUE FLICKITY -->
                <vue-flickity class="thumb-slider" ref="flickity" :options="flickityOptions">
                    <div v-for="(item, index) in feed" :key="index" :title="'#'+index + ' '+item.start_local" class="thumb-slider-item btn-tile">

                        <img src="/assets/img/layout/placeholder-thumbnail.png">
                        <span class="btn-tile-bg" :data-flickity-bg-lazyload="item.image_url"></span>

                        <div class="btn-tile-overlay">
                            <h3 class="btn-tile-header" v-text="formatTime(item.start_local)"></h3>
                        </div>
                    </div>
                </vue-flickity>

                <!-- SLIDER CONTROLS -->
                <button class="thumb-slider-prev-btn" @click="previous()"><i class="fa fa-angle-left"></i></button>
                <button class="thumb-slider-next-btn" @click="next()"><i class="fa fa-angle-right"></i></button>
            </div>
        </div>
    `,
    data() {
        return {
            flickityOptions: {
                adaptiveHeight: true,
                autoPlay: false,
                // autoPlay: 1500,
                cellAlign: 'left',
                contain: true,
                draggable: true, //(window.innerWidth <= 1024 ? true : false),
                //lazyLoad: true, //10 // <img src="placeholder.jpg" data-flickity-lazyload="full.jpg" />
                bgLazyLoad: 10,
                dragThreshold: 3,
                freeScroll: true,
                freeScrollFriction: 0.075, // lower friction, slides easier
                friction: 0.28, // Higher friction makes the slider feel stickier and less bouncy
                imagesLoaded: true,
                // initialIndex: 35, //this.currentIndex, //1, // originally disabled- problems with rendering
                pageDots: false,
                prevNextButtons: false,
                pauseAutoPlayOnHover: false,
                selectedAttraction: 0.025, // Higher attraction makes the slider move faster
                watchCSS: true, // run/destroy
                wrapAround: false, // infinite
            }
        }
    },

    created(){
        bus.$on('selectThumbnail', this.selectThumbnail);
    },

    mounted(){
        log('[mounted] - thumb-slider')
        this.setClickEvent();
    },

    watch: {

        //==================================================
        // WATCH - FEED
        //==================================================

        feed(){
            this.$refs.flickity.destroy();

            this.$nextTick(() => {
                this.$refs.flickity.rerender();
                this.setClickEvent();
            });
        },
        //==================================================
        // WATCH - CURRENT INDEX
        //==================================================

        currentIndex(){
            this.selectThumbnail(this.currentIndex);
        }
    },
    mixins: [utilities],
    methods: {
        //==================================================
        // SELECT
        //==================================================

        selectThumbnail(index) {
            this.$refs.flickity.select(index); // set by the time select ONLY - moves slides to index
        },
        //==================================================
        // SET CLICK EVENT
        //==================================================

        setClickEvent(){
            //==================================================
            // STATIC CLICK - to allows clicking and dragging
            //
            // https://flickity.metafizzy.co/events.html#staticclick
            // https://codepen.io/desandro/pen/RNQgxe?editors=1010
            // https://github.com/drewjbartlett/vue-flickity/issues/26
            //==================================================

            this.$refs.flickity.on('staticClick', (event, pointer, cellElement, cellIndex) => {
                if (!cellElement) {
                    return;
                }
                // log('Flickity StaticClick triggered')
                this.selectTimeIndex(cellIndex);
            });
        },
        //==================================================
        // SELECT TIME INDEX
        //==================================================

        selectTimeIndex(index) {
            log('[thumb-slider] - Emit Index: '+index);
            bus.$emit('setTimeIndex', index); // send back to the widget

            // Super Hack - flick time as null and back to index, so first thumbnail can be selected..
            // IN THE EVENT THAT the feed is overriding the player but the data is queued up to be zero
            // TLDR: trigger watcher on widget
            // Downside, first thumbnail will always trigger again, regardless of live or replay mode

            if (index == 0) {
                bus.$emit('setTimeIndex', 1);
                setTimeout(() => {
                    bus.$emit('setTimeIndex', index);
                }, 4); // 4ms browser standard?
            }
        },
        //==================================================
        // NEXT + PREVIOUS
        //==================================================

        next() {
            this.$refs.flickity.next();
        },

        previous() {
            this.$refs.flickity.previous();
        },

        // select: function(index){
        //     this.$refs.flickity('select', index);
        // }
    }
});
//-----------------------------------------------------------------
// VUE FLICKITY (WRAPPER FOR FLICKITY)
//-----------------------------------------------------------------

Vue.component('vue-flickity', {
    props: {
        options: {
            type: Object,
            default: function() {
                return {};
            }
        },
    },
    template: `
        <div>
            <slot></slot>
        </div>
    `,
    mounted() {
        this.init();
    },
    beforeDestroy() {
        this.flickity.destroy();
        this.flickity = null;
    },
    methods: {
        init() {
            this.flickity = new Flickity(this.$el, this.options);
            this.$emit('init', this.flickity);
        },
        next(isWrapped, isInstant) {
            this.flickity.next(isWrapped, isInstant);
        },
        previous(isWrapped, isInstant) {
            this.flickity.previous(isWrapped, isInstant);
        },
        select(index, isWrapped, isInstant) {
            this.flickity.select(index, isWrapped, isInstant);
        },
        selectedIndex() {
            return this.flickity.selectedIndex
        },
        selectCell(value, isWrapped, isInstant) {
            this.flickity.selectCell( value, isWrapped, isInstant );
        },
        resize() {
            this.flickity.resize();
        },
        reposition() {
            this.flickity.reposition();
        },
        prepend(elements) {
            this.flickity.prepend(elements);
        },
        append(elements) {
            this.flickity.append(elements);
        },
        insert(elements, index) {
            this.flickity.insert(elements, index);
        },
        remove(elements) {
            this.flickity.remove(elements);
        },
        playPlayer() {
            this.flickity.playPlayer();
        },
        stopPlayer() {
            this.flickity.stopPlayer();
        },
        pausePlayer() {
            this.flickity.pausePlayer();
        },
        unpausePlayer() {
            this.flickity.unpausePlayer();
        },
        rerender() {
            this.flickity.destroy();
            this.init();
        },
        destroy() {
            this.flickity.destroy();
        },
        reloadCells() {
            this.flickity.reloadCells();
        },
        getCellElements() {
            this.flickity.getCellElements();
        },
        data() {
            return Flickity.data(this.$el);
        },
        on(eventName, listener) {
            this.flickity.on(eventName, listener);
        },
        off(eventName, listener) {
            this.flickity.off(eventName, listener);
        },
        once(eventName, listener) {
            this.flickity.once(eventName, listener);
        }
    },
});
//-----------------------------------------------------------------
// SURFCAM WIDGET
//-----------------------------------------------------------------

Vue.component('surfcam-widget', {
    props: {
        liveStream: String,
        liveStreamImage: String,
        liveStreamPlaylist: String,
        dataPath: String,
        surfcamId: String,
    },
    //==================================================
    // DATA
    //==================================================

    data() {
        return {
            attempts:          0, // log attempts where data returned blank
            date:              null, // 'date-select' will change this - altering api request string
            feed:              null,
            feedType:          null,
            feedLoading:       null,
            firstRun:          null,
            rolledBack:        null, // use this to rollback dates if server fails on page load (not on user input)
            selectedTimeIndex: null, // changed by 'time-select' - used to move through thumbs via Flickity
        }
    },
    //==================================================
    // CREATED
    // alert watcher to fire new AJAX request on INIT
    // date-select will override this
    //==================================================

    created(){
        log('[created] - updating date');

        this.feedType = this.liveStream ? 'live' : 'replay'; // set the type for video-player and tabs
        this.date = { timeStamp: Date.now() } // spins up the app

        //==============================
        // BUS: SET TIME INDEX
        //==============================

        bus.$on('setTimeIndex', (index) => {
            this.selectedTimeIndex = index;
        });
    },
    //==================================================
    // WATCH - ORDER MATTERS
    //==================================================

    watch: {
        //==============================
        // 01. WATCH: DATE
        // When the date changes, get feed from server
        //==============================

        date(){
            var path = this.dataPath + this.surfcamId + '/' + moment(this.date.timeStamp).format('YYYY/MM/DD');
            log('[computed] Preparing New apiRequest: '+path);

            // :: loadData ::

            this.loadData(path); // request data, just don't loadVideo unless replay
        },
        //==================================================
        // 02. RESET FEED POSITION
        // UPDATES selectTimeIndex -> triggers watcher -> selectVideo
        // ref: trigger watcher to update - self.feed.length-1; //0; // invoke watcher to init at start 0 vid
        //==================================================

        feed() {
            this.selectedTimeIndex = 0; // reset time index when the feed reloads, back to beginning
        },
        //==============================
        // 03. WATCH: SELECTED TIME INDEX
        //==============================

        selectedTimeIndex(){
            log('[watch] - widget - selectedTimeIndex changed');
            this.getVideoIdFromHash();
            this.selectVideo();

            window.location.hash = this.feed[this.selectedTimeIndex].id; // add id to hash, allows link sharing
        }
    },
    //==================================================
    // METHODS
    //==================================================

    methods: {

        //==================================================
        // GET VIDEO FROM HASH
        //==================================================

        getVideoIdFromHash(){
            if (!this.firstRun) {
                var hashBang_arr = window.location.hash.split('/');
                var hashBang = hashBang_arr.slice(0, 1)[0];
                var video_id = hashBang = hashBang.slice(1); // slide '#'
                var feed = this.feed;

                for (var i = 0; i < feed.length; i++) {
                    if (feed[i].id == video_id) {
                        this.selectedTimeIndex = i;
                        log('HASH CHANGE selectedTimeIndex: '+this.selectedTimeIndex);

                        // need a timout to run after mounted (JQuery issue)
                        setTimeout(() => {
                            bus.$emit('selectThumbnail', this.selectedTimeIndex);
                        }, 1000); // 4ms browser standard?
                    }
                }
            }
        },
        //==================================================
        // SELECT VIDEO
        //==================================================

        selectVideo() {
            var payload;
            var video_obj = this.feed[this.selectedTimeIndex];
            var isLiveOnInit = this.feedType == 'live' && !this.firstRun;

            //==================================================
            // WHEN LIVE AND INIT
            //==================================================

            if (isLiveOnInit) {
                bus.$emit('initPlayer', 'limitDuration');

                payload = {
                    stream: this.liveStreamPlaylist, // !! WARNING !! - stream doesn't work, only playlist
                    image: this.liveStreamImage }

            } else {
                //==================================================
                // WHEN REPLAY
                //==================================================

                this.feedType = 'replay'; // set the tabs

                if (!this.firstRun) bus.$emit('initPlayer');

                try {
                    payload = {
                        stream: video_obj.video_url,
                        image: video_obj.video_url
                    }
                }
                catch(error) {
                    payload = {
                        stream: '.mp4',
                        image: '.jpg'
                    }
                }
            }
            //==================================================
            // LOAD VIDEO AFTER INIT
            //==================================================

            this.firstRun = true;
            bus.$emit('loadVideo', payload);

            //==================================================
            // GOOGLE TRACKING
            //==================================================

            if (this.feed && this.firstRun) this.sendTracking(video_obj); // can't report on video_url if LIVE init, or no feed
        },
        //==================================================
        // SEND TRACKING
        //==================================================

        sendTracking(video_obj){
            if (video_obj.length) {
                var eventLabel = video_obj.video_url.split('/');
                    eventLabel = eventLabel[3] + ' - ' + eventLabel[4]; // EG. snapper-rocks - 2018-02-04

                window.ga('send', 'event', 'Replays', 'Surfcam replay thumbnail clicked', eventLabel, {
                    nonInteraction: true
                });
            }
        },
        //==================================================
        // LOAD DATA - JUST STORES THE FEED
        //==================================================

        loadData(path) {
            log(':: loadData() ::');

            this.feedLoading = true; // show load indicator

            axios.get(path, '', {
                headers: {
                    'Accept': '*/*'
                }
            })
            .then((response) => {
                this.feedLoading = false; // stop loading

                //**************************************************
                // SUCCESS / FAILURE
                //**************************************************

                if (response.data.length){
                    log('~~ Success. Data found ~~');

                    this.feed = response.data.length ? response.data : false;
                    this.attempts = 0;

                    //++++++++++++++++++++++++++++++++++++++++++++++++
                    // TEST FOR EMPTY
                    //++++++++++++++++++++++++++++++++++++++++++++++++

                    // var random = Math.floor((Math.random() * 2) + 1);

                    // if (random == 2) {
                    //     var blah = [];
                    //     // previously null, explicityly tell watcher to update
                    //     if (!blah.length) this.feed = false;
                    //     log('X X X X X X X X X  FEED IS NULL  X X X X X X X X X X X X X X X');
                    // } else {
                    //     this.feed = response.data; // store data
                    // }
                    //++++++++++++++++++++++++++++++++++++++++++++++++

                } else {
                    log('~~~~~~~~~~~~ response.data returned empty ~~~~~~~~~~~~');
                    this.feed = null; // explicitly clear existing feed

                    //==================================================
                    // If feed returns empty, set time for yesterday and try again
                    //==================================================

                    if (!this.rolledBack) {
                        this.rolledBack = true; // only runs on init - not user input
                        if (this.attempts < 6) {
                            this.attempts++;
                            bus.$emit('setDate', this.attempts);
                        } else {
                            // stop trying
                            bus.$emit('setDate', 0); // reset to top date
                        }
                    }
                    //==================================================
                }
            })
            .catch((error) => {
                console.log('Server Error: '+error);
            });
        }
    }
    //==================================================
    //
    //==================================================
});
//-----------------------------------------------------------------
// VUE INSTANCE
//-----------------------------------------------------------------

new Vue({
    el: '#vue-app',
});

//-----------------------------------------------------------------
//
//-----------------------------------------------------------------
//==================================================
//
//==================================================