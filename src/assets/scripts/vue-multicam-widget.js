/*
    VUE-MULTICAM-WIDGET.JS
    updated: 03.08.18

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
                :options="options"
                :multiple="false"
                :group-select="true"
                :placeholder="'Select Surfcam ' + multicamId"
                label="name"
                group-values="locations"
                group-label="state"
                track-by="name"
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
    created() {
        // serve up stream from external id on INIT
        var stream = this.getStreamFromId(this.surfcamId);
        if (stream) {
            this.value = stream;
            this.broadcast();
        }
    },
    methods: {
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
        <video
            autoplay
            controls
            crossorigin
            muted
            playsinline
            poster="/assets/img/layout/placeholder-video-1280x720.svg"
            width="100%">
        </video>
    `,
    props: {
        source: String
    },
    data() {
        return {
            playerInstance: null,
            hlsInstance: null,
            videoTimeout: null
        }
    },
    mounted() {
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
            this.playerInstance = new Plyr(this.$el, {

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
                    'mute', // Toggle mute
                    'volume', // Volume control
                    // 'captions', // Toggle captions
                    'settings', // Settings menu
                    'pip', // Picture-in-picture (currently Safari only)
                    'airplay', // Airplay (currently Safari only)
                    //'fullscreen', // Toggle fullscreen
                ],
                clickToPlay: false,
                displayDuration: false
            });

            // setup timeout reset on play
            this.playerInstance.on('play', () => {
                this.startTimeout();
            });
        },
        loadVideo(path) {
            // this.$el.src = path; // iOS

            if (Hls.isSupported()) {
                // For more Hls.js options, see https://github.com/dailymotion/hls.js
                this.hlsInstance = new Hls();
                this.hlsInstance.loadSource(path);
                this.hlsInstance.attachMedia(this.$el);
                // this.hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
                //     this.hlsInstance.play();
                // });

            } else {
                this.$el.src = path; // iOS
                // console.log('Hls not supported');
            }
            this.startTimeout();
        },

        unloadVideo() {
            this.resetTimeout();
            this.hlsInstance = null;
            this.$el.src = '';
        },
        startTimeout() {
            this.resetTimeout();
            this.videoTimeout = setTimeout(() => {
                this.playerInstance.stop();
                this.resetTimeout();
            }, 300000); // 300000ms = 5 minute timeout
        },
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
            :style="{ zIndex: open ? 2002 : 1 }">

            <!-- EDIT BTN -->
            <button
                v-if="liveStreamPath"
                class="multicam-edit-btn"
                @click="editing = !editing">

                <div class="icon">
                    <i v-if="!editing" class="fa fa-edit"></i>
                    <i v-if="editing" class="fa fa-close"></i>
                </div>
            </button>

            <!-- MULTICAM SELECT -->
            <transition name="multicam-select-entrance">
                <multicam-select
                    v-show="editing"
                    :multicam-id="multicamId"
                    :style="{ background: liveStreamObj ? 'none' : '#b6b6b6 url(' + placeholder + ')'}"
                    :surfcam-id="surfcamId"
                    @open="open = $event"
                    @select-stream="storeStreamObj">
                </multicam-select>
            </transition>

            <!-- MULTICAM PLAYER -->
            <multicam-player
                :source="liveStreamPath"
                :placeholder="placeholder">
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
        placeholder: String,
        surfcamId: [String, Number]
    },
    data() {
        return {
            editing: null,
            liveStreamObj: null,
            liveStreamPath: null,
            open: false, // will trigger z-index on open select panels
        }
    },
    created() {
        // on INIT, check if cam has saved ID. If yes, disable editing mode
        this.editing = this.surfcamId ? false : true;
    },
    methods: {
        storeStreamObj(event) {

            this.liveStreamObj = event; // store obj

            // Hault everything if paywall is enabled
            // trigger the overlay
            if (this.paywallEnabled) {
                multicamBus.$emit('invoke-paywall');
                return;
            }

            else if (event != null) {
                this.liveStreamPath = this.path + event.path + '/playlist.m3u8'; // create path
                this.editing = false;
                this.updateServer('/multi-cam/save/' + event.id + '/' + this.multicamId); // multi-cam/save/[surfcam-id]/[position]
            } else {
                this.liveStreamPath = null; // for removal in select
                this.updateServer('/multi-cam/delete/' + this.multicamId); // multi-cam/delete/[position]
            }
        },

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
        })
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