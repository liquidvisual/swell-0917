/*
    VUE-VIDEO.JS - Last updated: 04.11.17

    <!-- <script src="https://unpkg.com/vue/dist/vue.js"></script> -->
    <!-- <script src="https://unpkg.com/axios/dist/axios.min.js"></script> -->
    <!-- <script src="https://unpkg.com/flickity@2/dist/flickity.pkgd.min.js"></script> -->
*/
//-----------------------------------------------------------------
// DATE SELECT COMPONENT
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
    data: function() {
        return {
            date: {},
            lastSevenDays: [],
        }
    },
    created: function() {
        var today = new Date();
        this.lastSevenDays = this.getDates(today, 6);
        this.date = this.lastSevenDays[0]; // set initial option as selected
        // this.broadcast();
    },
    methods: {
        //==================================
        // broadcast selected date
        //==================================

        broadcast: function(){
            this.$emit('input', this.date);
        },

        //==================================
        // getDates
        //==================================

        getDates: function(startDate, totalDays){

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
        //==================================
        // monthAsString
        //==================================

        monthAsString: function (monthIndex) {
            var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            return month[monthIndex];
        },
        //==================================
        // dayAsString
        //==================================

        dayAsString: function(dayIndex) {
            var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return weekdays[dayIndex];
        }
    }
});
//-----------------------------------------------------------------
// TIME SELECT COMPONENT
//-----------------------------------------------------------------

Vue.component('time-select', {
    props: {
        feed: {
            // type: Array,
            required: true,
            default: []
        }
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
    data: function() {
        return {
            selectedDateIndex: 0 // sends to flickity to update position
        }
    },
    created: function() {
        // this.broadcast();
    },
    methods: {
        //==================================
        // broadcast selected date
        //==================================

        broadcast: function(){
            this.$emit('input', this.selectedDateIndex);
        },

        //==================================
        // Format time - duplication
        //==================================
        formatTime: function(time){
            return moment(time).format('hh:mma'); // uses moment.js in global scope
        },
    }
});
//-----------------------------------------------------------------
// THUMB SLIDER COMPONENT
//-----------------------------------------------------------------

Vue.component('video-player', {
    props: {
        selectedVideo: {
            default: null
        }
    },
    template: `
        <div id="video" class="mb-5">
            <a href="selectedVideo.video_url">
                Watch this stream over your native player
            </a>
        </div>
    `,
    data: function() {
        return {
            player_conf: {
                autostart: true,
                primary: 'html5',
                fallback: true,
                androidhls: true,
                width: '100%',
                height: 421,
                logo: {
                    file: 'http://www.swellnet.com/profiles/swellnet/modules/features/swellnet_surfcam/assets/logo_transparent_overlay.png'
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
            }
        }
    },
    mounted: function() {
        // streamPath: 'rtmp://streamer.swellnet.com.au/surfcams/knights.stream',
        // playlistPath: 'https://streamer.swellnet.com.au/surfcams/knights.stream/playlist.m3u8',
        // imagePath: 'http://static.swellnet.com.au/images/surfcams/knights.jpg',

        // jwplayer('video').destroy();
        // this.playVideo(this.streamPath, this.playlistPath, this.imagePath);
        this.playVideo(this.selectedVideo.video_url, null, this.selectedVideo.image_url);
    },
    beforeDestroy: function() {
        // jwplayer('video').destroy();
    },
    watch: {
        selectedVideo: function(){
            console.log('its changing');
            // jwplayer('video').destroy();
            this.playVideo(this.selectedVideo.video_url, null, this.selectedVideo.image_url);
        },
    },
    methods: {
        playVideo: function(stream, playlist, image) {
            var newStream = {
                sources: [
                    {file: stream },
                    {file: playlist },
                ],
                image: image,
            };

            jQuery.extend(this.player_conf, newStream);
            jwplayer('video').setup(this.player_conf);
        }
    }
});
//-----------------------------------------------------------------
// THUMB SLIDER COMPONENT
//-----------------------------------------------------------------

Vue.component('thumb-slider', {
    props: {
        feed: {
            // type: Array,
            required: true,
            default: []
        },
        currentIndex: 0, // only the time select can change this
    },
    template: `
        <div class="thumb-slider-wrapper collapse-row-sm-only">
            <div class="thumb-slider-track">

                <vue-flickity class="thumb-slider" ref="flickity" :options="flickityOptions">
                    <a v-for="(item, index) in feed" :key="index" class="thumb-slider-item btn-tile" @click.prevent="selectFeedObj(item)">
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
    data: function() {
        return {
            flickityOptions: {
                adaptiveHeight: true,
                autoPlay: false,
                // autoPlay: 1500,
                cellAlign: 'left',
                contain: true,
                draggable: (window.innerWidth <= 1024 ? true : false),
                // lazyload: true, 10 // <img src="placeholder.jpg" data-flickity-lazyload="full.jpg" />
                // bgLazyLoad: 5,
                dragThreshold: 3,
                freeScroll: true,
                freeScrollFriction: 0.075, // lower friction, slides easier
                friction: 0.28, // Higher friction makes the slider feel stickier and less bouncy
                imagesLoaded: true,
                // initialIndex: 1, // disabled
                pageDots: false,
                prevNextButtons: false,
                pauseAutoPlayOnHover: false,
                selectedAttraction: 0.025, // Higher attraction makes the slider move faster
                watchCSS: true, // run/destroy
                wrapAround: false, // infinite
            }
        }
    },
    watch: {
        feed: function(){
            var self = this;

            this.$nextTick(function(){
                self.$refs.flickity.rerender();
            });
        },

        currentIndex: function(){
            this.$refs.flickity.select(this.currentIndex); // set by the time select - moves slides to index
        }
    },
    methods: {
        formatTime: function(time){
            return moment(time).format('hh:mma'); // uses moment.js in global scope
        },

        selectFeedObj: function(obj) {
            // console.log('Read to load: '+obj);
            this.$emit('select-video', obj); //********************* EMIT ************************
        },

        next: function() {
            this.$refs.flickity.next();
        },

        previous: function() {
            this.$refs.flickity.previous();
        },

        // select: function(index){
        //     this.$refs.flickity('select', index);
        // }
    }
});
//-----------------------------------------------------------------
// VUE FLICKITY COMPONENT (WRAPPER FOR FLICKITY)
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
    mounted: function() {
      this.init();
    },
    beforeDestroy: function() {
        this.flickity.destroy();
        this.flickity = null;
    },
    methods: {
        init: function() {
            this.flickity = new Flickity(this.$el, this.options);
            this.$emit('init', this.flickity);
        },
        next: function(isWrapped, isInstant) {
            this.flickity.next(isWrapped, isInstant);
        },
        previous: function(isWrapped, isInstant) {
            this.flickity.previous(isWrapped, isInstant);
        },
        select: function(index, isWrapped, isInstant) {
            this.flickity.select(index, isWrapped, isInstant);
        },
        selectedIndex: function() {
            return this.flickity.selectedIndex
        },
        selectCell: function(value, isWrapped, isInstant) {
            this.flickity.selectCell( value, isWrapped, isInstant );
        },
        resize: function() {
            this.flickity.resize();
        },
        reposition: function() {
            this.flickity.reposition();
        },
        prepend: function(elements) {
            this.flickity.prepend(elements);
        },
        append: function(elements) {
            this.flickity.append(elements);
        },
        insert: function(elements, index) {
            this.flickity.insert(elements, index);
        },
        remove: function(elements) {
            this.flickity.remove(elements);
        },
        playPlayer: function() {
            this.flickity.playPlayer();
        },
        stopPlayer: function() {
            this.flickity.stopPlayer();
        },
        pausePlayer: function() {
            this.flickity.pausePlayer();
        },
        unpausePlayer: function() {
            this.flickity.unpausePlayer();
        },
        rerender: function() {
            this.flickity.destroy();
            this.init();
        },
        destroy: function() {
            this.flickity.destroy();
        },
        reloadCells: function() {
            this.flickity.reloadCells();
        },
        getCellElements: function() {
            this.flickity.getCellElements();
        },
        data: function() {
            return Flickity.data(this.$el);
        },
        on: function(eventName, listener) {
            this.flickity.on(eventName, listener);
        },
        off: function(eventName, listener) {
            this.flickity.off(eventName, listener);
        },
        once: function(eventName, listener) {
            this.flickity.once(eventName, listener);
        }
    },
});
//-----------------------------------------------------------------
// VUE INSTANCE
//-----------------------------------------------------------------

new Vue({
    el: '#video-widget',
    data: function() {
        return {
            date: {
                timeStamp: Date.now() // data always starts with current datetime
            },
            selectedDateIndex: 0, // index from feed - changed by time select
            feed: null,
            feedLoading: false,
            apiPath: 'https://api.swellnet.com/v1/999/swellnet/recordings/29?token=j7n77SbJwTk88EsxSuTqm6jPCEfApN0zMfxLXylljvkj0DGJ',
            selectedVideo: {},
        }
    },
    //==================================
    // COMPUTED
    //==================================

    computed: {
        dateFormatted: function(){
            return moment(this.date.timeStamp).format('YYYY-MM-DD'); // uses moment.js in global scope
        },

        apiRequest: function(){
            // return this.apiPath + '&local_date=' + '2017-11-05'; // TESTING ONLY
            return this.apiPath + '&local_date=' + this.dateFormatted;
        },
    },
    //==================================
    // INIT
    // use current datetime to hit API and return data
    //==================================

    created: function() {
        this.loadData();
    },
    //==================================
    // METHODS
    //==================================

    watch: {
        apiRequest: function() {
            this.loadData();
        },

        // refactor this to computed property
        // when time select changes the index, update the video object. Other components will draw from
        selectedDateIndex: function(){
            this.selectedVideo = this.feed[this.selectedDateIndex];
        }
    },
    //==================================
    // METHODS
    //==================================

    methods: {
        loadData: function() {
            var self = this;
            this.feedLoading = true;

            axios.post(this.apiRequest, '', {
                headers: {
                    'Accept': '*/*'
                }
            })
            .then(function(response) {
                self.feed = response.data;
                self.feedLoading = false;

                console.log('feed:');
                console.log(self.apiRequest);
            })
            .catch(function(error) {
                console.log(error.response.data);
            });
        },

        selectVideo: function(obj){
            this.selectedVideo = obj; // set variable for video component
        }
    }
});

//-----------------------------------------------------------------
//
//-----------------------------------------------------------------
//==================================================
//
//==================================================