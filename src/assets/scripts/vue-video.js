/*
    VUE-VIDEO.JS
    updated: 22.01.18

    <!-- DEPENDENCIES -->
    <!-- https://unpkg.com/vue/dist/vue.js -->
    <!-- https://unpkg.com/axios/dist/axios.min.js -->
    <!-- https://unpkg.com/flickity@2/dist/flickity.pkgd.min.js -->

    todo:
        * allow drag without interfering click on desktop
            - https://github.com/metafizzy/flickity/issues/409
            - https://flickity.metafizzy.co/events.html#staticclick

        * incorporate url paths to drive clicks (hash fragments)
        * look into init and watch
        * does widget need to be vue instance?
        * uncomment line 557 and 332 for skipping to last item on init
*/
//-----------------------------------------------------------------
// DATE SELECT
//-----------------------------------------------------------------

Vue.component('date-select', {
    props: {
        fullWidth: {
            type: Boolean,
            default: false,
        }
    },
    template: `
        <div class="custom-select" :class="{ 'is-full-width': fullWidth }">
            <select v-model="date" @change="broadcast">
                <option v-for="(item, index) in lastSevenDays" :key="index" :value="item" v-text="item.title"></option>
            </select>
            <i class="fa fa-caret-down"></i>
            <i class="fa fa-calendar-o"></i>
        </div>
    `,
    data() {
        return {
            date: {},
            lastSevenDays: [],
        }
    },
    created() {
        var today = new Date();
        this.lastSevenDays = this.getDates(today, 6);
        this.date = this.lastSevenDays[0]; // set initial option as selected
        // this.broadcast();
    },
    methods: {
        //==================================================
        // broadcast selected date
        //==================================================

        broadcast(){
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
        // monthAsString
        //==================================================

        monthAsString(monthIndex) {
            var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            return month[monthIndex];
        },
        //==================================================
        // dayAsString
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
        feed: {
            // type: Array,
            required: true,
            default: []
        },
        index: 0,
    },
    template: `
        <div class="custom-select">
            <select v-model="selectedDateIndex" @change="broadcast">
                <option v-for="(item, index) in feed" :key="index" :value="index" v-text="formatTime(item.start_local)"></option>
            </select>
            <i class="fa fa-caret-down"></i>
            <i class="fa fa-clock-o"></i>
        </div>
    `,
    data() {
        return {
            selectedDateIndex: 0, // sends to flickity to update position
        }
    },
    created() {
        // this.broadcast();
    },
    watch: {
        index(){
            this.selectedDateIndex = this.index;
        }
    },
    methods: {
        //==================================================
        // broadcast selected date
        //==================================================

        broadcast(){
            this.$emit('input', this.selectedDateIndex);
        },

        //==================================================
        // Format time - duplication
        //==================================================

        formatTime(time){
            return moment(time).format('hh:mma');
        },
    }
});
//-----------------------------------------------------------------
// VIDEO PLAYER
//
// 1. component will either load video stream via selectedVideo (API)
// 2. OR component will load stream through props set on the template
//-----------------------------------------------------------------

Vue.component('video-player', {
    props: {
        selectedVideo: {
            default: null
        },
        liveStream: null,
        liveStreamImage: null,
        liveStreamPlaylist: null
    },
    data() {
        return {
            feedType: null,
            playerInstance: null,
            hasSetup: false, // video inits once only
            cooldown: false,
            unableToLoad: null,
        }
    },
    template: `
        <div id="video" class="mb-5">
            <img v-if="!selectedVideo && !liveStream" class="no-video-placeholder" width="100%" src="/assets/img/layout/placeholder-no-video.svg" alt="Sorry, there's no video.">
        </div>
    `,
    mounted() {
        this.playerInstance = jwplayer('video');

        // if live stream is set on the template (not API), load those paths instead
        if (this.liveStream) {
            this.playVideo(this.liveStream, this.liveStreamImage, this.liveStreamPlaylist);

            // set a 4 sec cooldown so the 'watch' will not trigger an overriding playVideo when and IF
            // the API returns after a delay.

            this.cooldown = true;
            setTimeout(() => { this.cooldown = false; }, 4000);
        }
    },
    beforeDestroy() {
        this.playerInstance.remove();
    },
    watch: {
        selectedVideo(){
            if (!this.cooldown) {
                this.playVideo();
            }
        },
    },
    methods: {
        // https://support.jwplayer.com/customer/portal/articles/1480872
        // https://developer.jwplayer.com/jw-player/docs/javascript-api-reference/#jwplayernext

        playVideo(streamOverride, streamImageOverride, streamPlaylistOverride) {

            var stream   = streamPlaylistOverride ? streamPlaylistOverride : this.selectedVideo.video_url;
            var image    = streamImageOverride    ? streamImageOverride    : this.selectedVideo.image_url;
            var playlist = streamPlaylistOverride ? streamPlaylistOverride : null; // api doesn't need playlist, live stream does

            //==================================================
            // SETUP ONCE ONLY
            // 1. Only live stream should include onTime stop
            // 2. Replays reinit only once for smoother performance
            //==================================================

            if (!this.hasSetup) {
                var player_conf = {
                    autostart: true,
                    primary: 'html5',
                    fallback: true,
                    file: stream,
                    image: image,
                    androidhls: true,
                    width: '100%',
                    height: 421,
                    repeat: true,
                    // logo: {
                        // file: 'http://www.swellnet.com/profiles/swellnet/modules/features/swellnet_surfcam/assets/logo_transparent_overlay.png'
                    // },
                    stagevideo: false,
                    events: {
                        onReady(e) {
                            window.swellnetElapsedTime = 0;
                        },
                        onTime(e) {
                            if ((window.swellnetElapsedTime + e.position) >= '300') {
                                if (streamOverride) {
                                    // console.log('streamOverride Triggered - video has livestream setup - will stop after 300 sec');
                                    this.stop();
                                }
                            }
                        },
                        onPause(e) {
                            window.swellnetElapsedTime += this.getPosition();
                        }
                    }
                }

                // console.log('Initialising Video Config');
                this.playerInstance.setup(player_conf);

                // Only allow rebuilding INIT behavior for replays (first time) or livestream
                this.hasSetup = streamOverride ? false : true;

                var feedType = streamOverride ? 'live' : 'replay';

                this.$emit('set-feed-type', feedType); //********************* EMIT - getting too complex now ************************
            }

            //==================================================
            // LOAD AND PLAY
            //==================================================

            this.playerInstance.load([{
                file: stream,
                image: image
            }]).play();
        }
    }
});
//-----------------------------------------------------------------
// THUMB SLIDER
//-----------------------------------------------------------------

Vue.component('thumb-slider', {
    props: {
        feed: {
            // type: Array,
            required: true,
            default: []
        },
        feedLoading: true,
        currentIndex: 0, // only the time select can change this
    },
    template: `
        <div class="thumb-slider-wrapper collapse-row-sm-only">
            <div class="thumb-slider-track">

                <vue-flickity class="thumb-slider" ref="flickity" :options="flickityOptions">
                    <a v-for="(item, index) in feed" :key="index" :title="'#'+index + ' '+item.start_local" class="thumb-slider-item btn-tile" @click.prevent="selectFeedObj(item, index)">
                        <img src="/assets/img/layout/placeholder-thumbnail.png">

                        <span class="btn-tile-bg" :style="{ 'background-image': 'url('+item.image_url+')'}"></span>
                        <!-- data-flickity-bg-lazyload="tulip.jpg" -->

                        <div class="btn-tile-overlay">
                            <h3 class="btn-tile-header" v-text="formatTime(item.start_local)"></h3>
                        </div>
                    </a>
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
                draggable: (window.innerWidth <= 1024 ? true : false),
                // lazyload: true, //10 // <img src="placeholder.jpg" data-flickity-lazyload="full.jpg" />
                // bgLazyLoad: 5,
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
    // mounted(){
    //     this.$refs.flickity.select(this.currentIndex); // bit hacky, ensure slides move to match time
    // },
    watch: {
        feed(){
            this.$refs.flickity.destroy();

            this.$nextTick(() => {
                this.$refs.flickity.rerender();
            });
        },

        currentIndex(){
            this.$refs.flickity.select(this.currentIndex); // set by the time select ONLY - moves slides to index
        }
    },
    methods: {
        formatTime(time){
            return moment(time).format('hh:mma'); // uses moment.js in global scope
        },

        selectFeedObj(obj, index) {
            // console.log('Read to load: '+obj);
            var payload = {};
                payload.obj = obj;
                payload.index = index; // need to update the index for time-select

            this.$emit('select-video', payload); //********************* EMIT ************************
        },

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
// VUE INSTANCE
//-----------------------------------------------------------------

new Vue({
    el: '#video-widget',
    data() {
        return {
            apiPath: null,  // beforeMount sets this based on surfcam ID passed as attribute | EG. /surfcam-replays/data/29/2018/01/12
            feed: null,
            feedType: null,
            feedLoading: true,
            date: { timeStamp: Date.now() }, // 'date-select' will change this - altering api request string
            selectedDateIndex: null, // changed by 'time-select' - used to move through thumbs via Flickity
            selectedVideo: null, // set by 'time-select' or clicking thumb
        }
    },

    //==================================================
    // COMPUTED
    //==================================================

    computed: {
        apiRequest(){
            // console.log('Computed: '+this.token);
            return this.apiPath + moment(this.date.timeStamp).format('YYYY/MM/DD');
        }
    },

    //==================================================
    // WATCH
    //==================================================

    watch: {
        apiRequest() {
            // console.log('watch');
            this.loadData();
        },

        // when 'time-select' changes the index, update the video object. Other components will respond.
        selectedDateIndex(){
            this.selectedVideo = this.feed[this.selectedDateIndex];
        }
    },

    //==================================================
    // BEFORE MOUNT
    // needs to get attribute passed to module
    //==================================================

    beforeMount(){
        // console.log('beforeMount');
        var surfcamId = this.$el.attributes['surfcam-id'].value; // EG. 29
        var surfcamPath = this.$el.attributes['surfcam-path'].value // EG. http://staging.swellnet.com.fe2.stg.swellnet.anchor.net.au/surfcam-replays/data/

        if (!surfcamPath) surfcamPath = '/'; // passing blank will make relative to domain

        this.apiPath = surfcamPath + surfcamId + '/'; // EG. http://staging.swellnet.com.fe2.stg.swellnet.anchor.net.au/surfcam-replays/data/29/
    },

    //==================================================
    // METHODS
    //==================================================

    methods: {
        loadData() {
            // console.log(':: loadData ::');
            var self = this;

            this.feedLoading = true; // show load indicator

            axios.get(self.apiRequest, '', {
                headers: {
                    'Accept': '*/*'
                }
            })
            .then((response) => {

                if (response.data.length){
                    self.feed = response.data;
                    self.feedLoading = false;
                    self.selectedDateIndex = 0; //self.feed.length-1; //0; // invoke watcher to init at start 0 vid
                } else {
                    // If feed returns empty, set time for yesterday and try again
                    // var d = new Date();
                    // var yesterday = d.setDate(d.getDate()-1);
                    // self.date = { timeStamp: yesterday };
                }
            })
            .catch((error) => {
                console.log(error);
            });
        },

        //==================================================
        // SELECT VIDEO
        //==================================================

        selectVideo(payload){
            this.selectedVideo = payload.obj; // set variable for video component
            this.selectedDateIndex = payload.index;

            // this can go on setFeedType if you want to track the dropdown choice too
            var eventLabel = this.selectedVideo.video_url.split('/');
                eventLabel = eventLabel[3] + ' - ' + eventLabel[4]; // EG. snapper-rocks - 2018-02-04

            // console.log(eventLabel);

            window.ga('send', 'event', 'Replays', 'Surfcam replay thumbnail clicked', eventLabel, {
                nonInteraction: true
            });
        },

        //==================================================
        // SET FEED TYPE
        //==================================================

        setFeedType(payload){
            this.feedType = payload; // set variable for video component

            // if it's a live feed - wipe the current selectedVideo - this can only be set by replays
            // also fixes problem of first thumb not triggering play init. mMssy, needs overhaul.
            if (payload == 'live') {
                setTimeout(() => {
                    this.selectedVideo = null;
                    // console.log('erasing');
                }, 500); // hacky
            }
            // console.log('what is the feedtype?: '+payload);
        }
    }
});
//-----------------------------------------------------------------
//
//-----------------------------------------------------------------
//==================================================
//
//==================================================