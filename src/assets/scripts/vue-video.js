/*
    VUE-VIDEO.JS - Last updated: 02.11.17
*/
//-----------------------------------------------------------------
// VUE TARGETS 'video.html'
//-----------------------------------------------------------------
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
        <!-- DATE DROPDOWN -->
        <div class="custom-select-wrapper collapse-row-sm-only">
            <div class="custom-select" :class="{ 'is-full-width': fullWidth }">
                <select v-model="date" @change="broadcast">
                    <option v-for="(item, index) in lastSevenDays" :key="index" :value="item" v-text="item.title"></option>
                </select>
                <i class="fa fa-caret-down"></i>
                <i class="fa fa-calendar-o"></i>
            </div>
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
// THUMB SLIDER COMPONENT
//-----------------------------------------------------------------

Vue.component('thumb-slider', {
    props: {
        feed: {
            // type: Array,
            required: true,
            default: []
        },
    },
    template: `
        <div class="thumb-slider-wrapper collapse-row-sm-only">
            <div class="thumb-slider-track">

                <vue-flickity class="thumb-slider" ref="flickity" :options="flickityOptions">
                    <a v-for="(item, index) in feed" :key="index" class="thumb-slider-item btn-tile" @click.prevent="loadVideo(item.video_url)">
                        <img src="/assets/img/layout/placeholder-thumbnail.png">
                        <span class="btn-tile-bg" :style="{ 'background-image': 'url('+item.image_url+')'}"></span>
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
        }
    },
    methods: {
        formatTime: function(time){
            return moment(time).format('hh:mma'); // uses moment.js in global scope
        },

        loadVideo: function(path) {
            // console.log('Read to load: '+path);
            this.$emit('select-video', path); //********************* EMIT ************************
        },

        next: function() {
            this.$refs.flickity.next();
        },

        previous: function() {
            this.$refs.flickity.previous();
        }
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
            <a href="selectedVideo">
                Watch this stream over your native player
            </a>
        </div>
    `,
    data: function() {
        return {
            streamPath: 'rtmp://streamer.swellnet.com.au/surfcams/knights.stream',
            playlistPath: 'https://streamer.swellnet.com.au/surfcams/knights.stream/playlist.m3u8',
            imagePath: 'http://static.swellnet.com.au/images/surfcams/knights.jpg',

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
        // this.playVideo(this.streamPath, this.playlistPath, this.imagePath);
    },
    beforeDestroy: function() {
        jwplayer('video').destroy();
    },
    watch: {
        selectedVideo: function(){
            console.log('its changing');
            // jwplayer('video').destroy();
            this.playVideo(this.selectedVideo, this.playlistPath, this.imagePath);
        }
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
            feed: null,
            feedLoading: false,
            apiPath: 'https://api.swellnet.com/v1/999/swellnet/recordings/29?token=YQ8KXtI5aMmEPGazzZrrebwRatWxFR0vy05nkFkkiwPX3Pnt',
            selectedVideo: null,
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
            return this.apiPath + '&local_date=' + this.dateFormatted;
        }
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
            })
            .catch(function(error) {
                console.log(error.response.data);
            });
        },

        selectVideo: function(path){
            this.selectedVideo = path; // set variable for video component
        }
    }
});

//-----------------------------------------------------------------
//
//-----------------------------------------------------------------
//==================================================
//
//==================================================