/*
    VUE-MULTICAM-WIDGET.JS
    updated: 05.08.18

    DEPENDENCIES
        https://unpkg.com/vue/dist/vue.js
        https://unpkg.com/axios/dist/axios.min.js
*/
//-----------------------------------------------------------------
// VARIABLES
//-----------------------------------------------------------------
//-----------------------------------------------------------------
// EVENT BUS
//-----------------------------------------------------------------

const multicamBus = new Vue();

//-----------------------------------------------------------------
// MULTICAM WIDGET > MULTICAM > SELECT
//-----------------------------------------------------------------

Vue.component('multicam-select', {
    components: {
        Multiselect: window.VueMultiselect.default
    },
    template: `
        <div class="multicam-select">

            <!-- MULTISELECT -->
            <multiselect
                v-model="value"
                label="name"
                group-values="locations"
                group-label="state"
                track-by="name"
                :group-select="true"
                :max-height="250"
                :multiple="false"
                :options="options"
                :placeholder="'Select Surfcam ' + multicamId"
                @open="$emit('open', true)"
                @close="$emit('open', false)"
                @input="broadcast()">
                <span slot="noResult">Sorry, no results.</span>
            </multiselect>
        </div>
    `,
    props: {
        multicamId: [String, Number],
        surfcamId: [String, Number],
        editing: Boolean
    },
    data() {
        return {
            value: null,
            options: [
                {
                    state: 'Queensland',
                    locations: [
                        { id: 876,    name: 'Duranbah',          path: 'duranbah.stream' },
                        { id: 250741, name: 'Snapper Rocks',     path: 'snapper-rocks.stream' },
                        { id: 250746, name: 'Greenmount',        path: 'greenmount.stream' },
                        { id: 343461, name: 'Currumbin',         path: 'currumbin.stream' },
                        { id: 851,    name: 'Burleigh Heads',    path: 'burleigh.stream' },
                        { id: 351381, name: 'Narrowneck',        path: 'narrowneck.stream' },
                        { id: 328776, name: 'Kings Beach',       path: 'kings-beach.stream' },
                        { id: 896,    name: 'Moffat Beach',      path: 'moffat-beach.stream' },
                        { id: 328632, name: 'Alex Headland',     path: 'alex-headland.stream' },
                        { id: 333699, name: 'Coolum',            path: 'coolum.stream' },
                        { id: 334466, name: 'Sunshine Beach',    path: 'sunshine-beach.stream' },
                        { id: 856,    name: 'Noosa Heads',       path: 'noosa.stream' }
                    ]
                },
                {
                    state: 'New South Wales',
                    locations: [
                        { id: 328177, name: 'Kingscliff',        path: 'kingscliff.stream' },
                        { id: 335898, name: 'Cabarita',          path: 'cabarita.stream' },
                        { id: 866,    name: 'Byron Bay',         path: 'byron.stream' },
                        { id: 331984, name: 'Yamba',             path: 'yamba.stream' },
                        { id: 329830, name: 'Park Beach',        path: 'park-beach.stream' },
                        { id: 766,    name: 'Coffs Harbour',     path: 'coffs-harbour.stream' },
                        { id: 781,    name: 'Newcastle',         path: 'newcastle.stream' },
                        { id: 394603, name: 'Avoca Beach',       path: 'avoca-beach.stream' },
                        { id: 776,    name: 'Narrabeen',         path: 'narrabeen.stream' },
                        { id: 771,    name: 'Manly',             path: 'manly.stream' },
                        { id: 761,    name: 'Bondi',             path: 'bondi.stream' },
                        { id: 881,    name: 'Maroubra',          path: 'maroubra.stream' },
                        { id: 786,    name: 'Shark Island',      path: 'shark-island.stream' },
                        { id: 886,    name: 'Cronulla Point',    path: 'cronulla-point.stream' },
                        { id: 891,    name: 'Cronulla Beaches',  path: 'cronulla-beaches.stream' },
                        { id: 841,    name: 'Thirroul',          path: 'thirroul.stream' },
                        { id: 791,    name: 'Wollongong',        path: 'wollongong.stream' }
                    ]
                },
                {
                    state: 'Victoria',
                    locations: [
                        { id: 382063, name: 'Woolamai',          path: 'woolamai.stream' },
                        { id: 861,    name: 'Torquay',           path: 'torquay.stream' },
                        { id: 811,    name: 'Portsea',           path: 'portsea.stream' },
                        { id: 796,    name: '13th Beach',        path: '13th-beach.stream' },
                        { id: 806,    name: 'Lorne',             path: 'lorne.stream' }
                    ],
                },
                {
                    state: 'South Australia',
                    locations: [
                        { id: 816,    name: 'Knights',           path: 'knights.stream' },
                        { id: 871,    name: 'Middleton',         path: 'middleton.stream' },
                        { id: 382064, name: 'Trigs',             path: 'trigs.stream' },
                        { id: 382064, name: 'Christies Beach',   path: 'christies-beach.stream' },
                        { id: 821,    name: 'South Port',        path: 'south-port.stream' }
                    ],
                },
                {
                    state: 'Western Australia',
                    locations: [
                        { id: 846,    name: 'Margaret River',    path: 'margaret-river.stream' },
                        { id: 831,    name: 'Yallingup',         path: 'yallingup.stream' },
                        { id: 826,    name: 'Scarborough',       path: 'scarborough.stream' }
                    ]
                }
            ]
        }
    },
    watch: {
        editing() {
            if (this.editing) {
                this.value = null; // clear for new selection
            }
        }
    },
    created() {
        // serve up stream from external id on INIT
        var stream = this.getStreamFromId(this.surfcamId);
        if (stream) {
            this.value = stream;
            this.broadcast();
        }
    },
    methods: {
        //==================================================
        // BROADCAST
        //==================================================

        broadcast() {
            this.$emit('select-stream', this.value); // INSIDE > OUT: send value back out to widget
        },
        //==================================================
        // GET STREAM FROM ID (refactor)
        // eg. array.find(item => item.id === id);
        //==================================================

        getStreamFromId(id) {
            for (item in this.options) {
                var locations = this.options[item].locations;

                for (var i=0; i<locations.length; i++) {
                    if (locations[i].id == id) {
                        return locations[i];
                    }
                }
            }
        }
    }
});

//-----------------------------------------------------------------
// MULTICAM WIDGET > MULTICAM > PLAYER (PLYR)
//-----------------------------------------------------------------

Vue.component('multicam-player', {
    template: `
        <div class="multicam-player">

            <!-- ERRORS -->
            <div
                v-if="errors"
                class="multicam-player-error">

                <div>
                    <i class="fa fa-warning"></i>
                    <p>Sorry! We're experiencing technical difficulties with this surfcam. We'll have it back up ASAP.</p>
                </div>
            </div>

            <!-- WATERMARK -->
            <div class="multicam-player-watermark"></div>

            <!-- VIDEO -->
            <video
                autoplay
                controls
                crossorigin
                muted
                playsinline
                ref="video"
                :poster="poster"
                width="100%">
            </video>
        </div>
    `,
    props: {
        errors: Boolean,
        source: String,
        poster: {
            type: String,
            default: '/assets/img/layout/placeholder-video-1280x720.svg'
        }
    },
    data() {
        return {
            playerInstance: null,
            hlsInstance: null,
            showControls: null,
            videoEl: null,
            videoTimeout: null
        }
    },
    mounted() {
        this.videoEl = this.$refs.video;
        this.initPlayer();
    },
    beforeDestroy() {
        this.playerInstance.destroy();
        this.playerInstance = null; // necessary?
    },
    watch: {
        source() {
            if (this.source) {
                this.loadVideo(this.source); // when source changes, load new video
            } else {
                this.unloadVideo(); // reset
            }
        }
    },
    methods: {
        initPlayer() {
            this.playerInstance = new Plyr(this.videoEl, {

                // https://github.com/sampotts/plyr/blob/master/controls.md
                controls: [
                    'play-large', // The large play button in the center
                    // 'restart', // Restart playback
                    // 'rewind', // Rewind by the seek time (default 10 seconds)
                    'play', // Play/pause playback
                    // 'fast-forward', // Fast forward by the seek time (default 10 seconds)
                    // 'progress', // The progress bar and scrubber for playback and buffering
                    // 'current-time', // The current time of playback
                    // 'duration', // The full duration of the media
                    //'mute', // Toggle mute
                    //'volume', // Volume control
                    // 'captions', // Toggle captions
                    // 'settings', // Settings menu
                    // 'pip', // Picture-in-picture (currently Safari only)
                    // 'airplay', // Airplay (currently Safari only)
                    //'fullscreen', // Toggle fullscreen
                ],
                clickToPlay: true,
                displayDuration: false
            });

            // setup timeout reset on play
            this.playerInstance.on('play', () => {
                this.startTimeout();
            });

            // TODO: show loader on stall (for non hls which has a delay)
            // this.playerInstance.on('stalled', (event) => {
                // console.log('stalled! '+event);
            // });

            // CONTROLS SHOWN
            this.playerInstance.on('controlsshown', (event) => {
                this.$emit('show-controls', true);
                this.showControls = true;
            });

            // CONTROLS HIDDEN
            this.playerInstance.on('controlshidden', (event) => {
                this.$emit('show-controls', false);
                this.showControls = false;
            });
        },
        //==================================================
        // LOAD VIDEO
        //==================================================

        loadVideo(path) {
            // For more Hls.js options, see https://github.com/dailymotion/hls.js
            if (!Hls.isSupported()) {
                this.videoEl.src = path; // eg. iOS

                // Errors for non hls only (iOS)
                this.playerInstance.on('error', (event) => {
                    this.$emit('log-errors');
                });
            }
            else {
                this.hlsInstance = new Hls();
                this.hlsInstance.loadSource(path);
                this.hlsInstance.attachMedia(this.videoEl);

                // Errors for hls only
                this.hlsInstance.on(Hls.Events.ERROR, (event, data) => {
                    if (data.fatal) this.$emit('log-errors');
                });
            }
            this.startTimeout(); // start timer until pause
        },
        //==================================================
        // UNLOAD VIDEO
        //==================================================

        unloadVideo() {
            this.resetTimeout();
            this.hlsInstance = null;
            this.videoEl.src = '';
        },
        //==================================================
        // START TIMEOUT
        //==================================================

        startTimeout() {
            this.resetTimeout();
            this.videoTimeout = setTimeout(() => {
                this.playerInstance.pause();
                this.resetTimeout();
            }, 300000); // 300000ms = 5 minute timeout
        },
        //==================================================
        // RESET TIMEOUT
        //==================================================

        resetTimeout() {
            clearTimeout(this.videoTimeout);
            this.videoTimeout = null;
        }
    }
});

//-----------------------------------------------------------------
// MULTICAM WIDGET > MULTICAM
//-----------------------------------------------------------------

Vue.component('multicam', {
    template: `
        <div
            class="multicam-widget"
            :class="{ 'is-editing': editing }"
            :style="{ zIndex: open ? 2002 : 1 }"
            @mouseleave="hovering = false">

            <!-- EDIT BTN -->
            <transition name="multicam-select-entrance">
                <button
                    v-if="liveStreamPath && (showEditBtn || hovering)"
                    class="multicam-edit-btn"
                    @click="edit"
                    @mouseover="hovering = true">

                    <div class="icon">
                        <i v-if="!editing" class="fa fa-edit"></i>
                    </div>
                </button>
            </transition>

            <!-- MULTICAM SELECT -->
            <transition name="multicam-select-entrance">
                <multicam-select
                    v-show="editing"
                    :multicam-id="multicamId"
                    :editing="editing"
                    :style="{ backgroundImage: 'url(' + poster + ')'}"
                    :surfcam-id="surfcamId"
                    @open="open = $event"
                    @select-stream="storeStreamObj">
                </multicam-select>
            </transition>

            <!-- MULTICAM PLAYER -->
            <multicam-player
                :source="liveStreamPath"
                :poster="poster"
                :errors="errors"
                @log-errors="errors = editing ? false : true"
                @show-controls="showEditBtn = hovering ? true : $event">
            </multicam-player>

        </div>
    `,
    props: {
        multicamId: [String, Number], // used to identify multicam - shown in select placeholder
        path: {
            type: String,
            default: 'https://streamer.swellnet.com.au/surfcams/' // can be overriden
        },
        paywallEnabled: Boolean,
        poster: String,
        surfcamId: [String, Number]
    },
    data() {
        return {
            editing: null,
            errors: null,
            hovering: false,
            firstRun: true,
            liveStreamObj: null,
            liveStreamPath: null,
            open: false, // will trigger z-index on open select panels
            showEditBtn: false
        }
    },
    created() {
        // on INIT, check if cam has saved ID. If yes, disable editing mode
        this.editing = this.surfcamId ? false : true;
    },
    methods: {

        //==================================================
        // EDIT MODE
        //==================================================

        edit() {
            this.editing = true;
            this.errors = null; // reset errors
            this.removeStreamObj();
        },
        //==================================================
        // STORE STREAM OBJ
        //==================================================

        storeStreamObj(event) {

            this.liveStreamObj = event; // store obj
            this.hovering = false;

            // Hault everything if paywall is enabled
            // trigger the overlay
            if (this.paywallEnabled) {
                multicamBus.$emit('invoke-paywall');
                return;
            }
            else if (event == null) {
                this.removeStreamObj();
            }
            else {
                this.editing = false;
                this.liveStreamPath = this.path + event.path + '/playlist.m3u8'; // create path

                // If firstRun and surfcam is provided, assume was saved
                if (this.firstRun) {
                    this.firstRun = false;
                    if (this.surfcamId) return;
                }

                this.updateServer('/multi-cam/save/' + event.id + '/' + this.multicamId); // multi-cam/save/[surfcam-id]/[position]
            }
        },
        //==================================================
        // REMOVE STREAM OBJ
        //==================================================

        removeStreamObj() {
            this.liveStreamObj = null;
            this.liveStreamPath = null; // for removal in select & edit
            this.updateServer('/multi-cam/delete/' + this.multicamId); // multi-cam/delete/[position]
        },
        //==================================================
        // UPDATE SERVER
        //==================================================

        updateServer(path) {
            axios.get(path, '', {
                headers: {
                    'Accept': '*/*'
                }
            })
            .then((response) => {
                //**************************************************
            })
            .catch((error) => {

            });
        }
    }
});

//-----------------------------------------------------------------
// MULTICAM WIDGET
//-----------------------------------------------------------------

Vue.component('multicam-widget', {
    props: {
        paywallEnabled: { // paywall exists?
            type: [String, Boolean],
            default: false,
        },
    },
    data() {
        return {
            paywallActive: false, // trigger!
        }
    },
    created() {
        multicamBus.$on('invoke-paywall', () => {
            this.paywallActive = true; // for styles
        });
    }
});

//-----------------------------------------------------------------
// VUE INSTANCE
//-----------------------------------------------------------------

if (document.getElementById('vue-multicam')) {
    new Vue({
        el: '#vue-multicam',
    })
}
//-----------------------------------------------------------------
//
//-----------------------------------------------------------------
//==================================================
//
//==================================================