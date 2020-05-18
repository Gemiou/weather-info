<template>
    <v-card
    elevation="0"
    id="main-card"
    >
        <l-map
          style="height: 80vh"
          v-bind:class="{ 'side-open': dataCard }"
          :zoom="zoom"
          :center="center"
          @click="getData"
          id="main-map"
        >

            <l-tile-layer :url="url"/>
            <l-marker v-if="currentPosition" :lat-lng="currentPosition" ref="marker"></l-marker>

        </l-map>
        <!-- CARD -->
            <v-card
            elevation="0"
            width="400"
            id="informations"
            v-bind:class="{ active: dataCard }"
            color="rgba(255, 0, 0, 0)"
            >
                <!-- SKELETON LOADING -->
                <v-card
                elevation="0"
                v-if="loading"
                loading
                width="400"
                color="rgba(255, 0, 0, 0)"
                >
                    <v-skeleton-loader
                    class="mx-auto"
                    type="list-item-two-line, table-heading, card-heading, list-item, list-item, list-item, list-item, list-item, list-item, list-item, list-item"
                    ></v-skeleton-loader>
                </v-card>
                <!-- //SKELETON LOADING -->

                <!-- DATA -->
                <v-card
                v-else
                elevation="0"
                color="rgba(255, 0, 0, 0)"
                width="400"
                >
                    <div @click="dataCard = false" class="close_card"><v-icon>mdi-close</v-icon></div>
                    <v-list-item two-line>
                        <v-list-item-content>
                            <v-list-item-title class="headline">{{locationName}}</v-list-item-title>
                            <v-list-item-subtitle>
                                <v-icon>mdi-water</v-icon>Humidity: {{currentHum}}%
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>

                    <v-card-text>
                        <v-row align="center">
                            <v-col class="display-3" cols="6">
                            {{currentTemp}}°C
                            </v-col>
                            <v-col cols="6">
                                <v-img
                                :src="tempImage"
                                width="92"
                                ></v-img>
                            </v-col>
                        </v-row>
                    </v-card-text>

                   

                    <v-slider
                    v-model="todayDate"
                    :max="6"
                    :tick-labels="labels"
                    class="mx-4"
                    ticks
                    ></v-slider>

                    <v-list class="transparent">
                        <v-list-item
                        v-for="item in forecast"
                        :key="item.day"
                        >
                            <v-list-item-subtitle>{{ item.day }}</v-list-item-subtitle>
                            <v-list-item-subtitle class="text-right">
                                <v-icon>mdi-water</v-icon> {{ item.temp }}%
                            </v-list-item-subtitle>
                            <v-list-item-subtitle class="text-right">
                                <v-icon>mdi-white-balance-sunny</v-icon> {{ item.hum }}°C
                            </v-list-item-subtitle>
                        </v-list-item>
                        <v-pagination
                          :length="6"
                          class="mt-5"
                          circle
                        ></v-pagination>
                    </v-list>

                </v-card>
                <!-- //DATA -->
                
            </v-card>
            <!-- //CARD -->
    </v-card>

</template>

<script>
import { latLng } from "leaflet";
import { LMap, LTileLayer, LMarker, LPopup, LTooltip } from 'vue2-leaflet';

  export default {
    name: 'Map',

    components: {
        LMap,
        LTileLayer,
        LMarker,
        LPopup,
        LTooltip
    },

    data: () => ({
        loading: true,
        zoom: 10,
        locationName: '',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        currentPosition: false,
        center: latLng(40.6849849,22.9583805),
        currentTemp: '',
        currentHum: '',
        tempImage: '',
        showMap: true,
        showData: true,
        labels: ['MO', 'TU', 'WED', 'TH', 'FR', 'SA', 'SU'],
        todayDate: 0,
        fullDate: '',
        date: '',
        dataCard: false,
        forecast: [
            { day: '08:00', temp: '24', hum: '41' },
            { day: '09:00', temp: '26', hum: '46' },
            { day: '10:00', temp: '21', hum: '43' },
            { day: '11:00', temp: '25', hum: '37' },
        ],
    }),

    created() {
        this.date = new Date()
        this.date.setDate(this.date.getDate())
        this.todayDate = this.labels[this.date.getDay() - 1]
        this.fullDate = this.date.getFullYear() + '-'
                + ('0' + (this.date.getMonth()+1)).slice(-2) + '-'
                + ('0' + this.date.getDate()).slice(-2)
    },

    methods: {
        getData(map) {
            
            var self = this
            self.loading = true

            // Get Temperature and Humidity Info
            this.$http.get(this.apiURL, {
                params: {
                    'lat': map.latlng.lat,
                    'lon': map.latlng.lng,
                    'at_date': this.fullDate,
                    'variable': 'temperature2m,rh2m',
                }
            }).then((results) => {

                var clearTemp = parseFloat(results.data.temperature2m.data[this.fullDate+"T"+this.date.getHours()+":00:00+0000"]).toFixed(0);
                var clearHum = parseFloat(results.data.rh2m.data[this.fullDate+"T"+this.date.getHours()+":00:00+0000"]).toFixed(0);

                this.currentTemp = clearTemp
                this.currentHum = clearHum

                if (clearTemp < 5) {
                    this.tempImage = 'cold.png'
                } else if (clearTemp > 5) {
                    this.tempImage = 'sun.png'
                } else if (clearTemp > 40) {
                    this.tempImage = 'isetfiretotherain.png'
                }

                // Get Location (Suburb - City - Village)
                this.$http.get('https://nominatim.openstreetmap.org/reverse?format=json&lat', {
                    params: {
                        'lat': map.latlng.lat,
                        'lon': map.latlng.lng
                    }
                }).then((result) => {
                    if (result.data.address.suburb) {
                        this.locationName = result.data.address.suburb
                    } else if (result.data.address.city) {
                        this.locationName = result.data.address.city
                    } else if (result.data.address.village) {
                        this.locationName = result.data.address.village
                    } else if (result.data.address.town) {
                        this.locationName = result.data.address.town
                    } else {
                        this.locationName = 'No location title found'
                    }

                }).catch(error => {
                    this.locationName = 'Problem finding location'
                    console.err(error)
                })

                self.loading = false
            })

            this.currentPosition = map.latlng
            this.dataCard = true
            this.$nextTick(() => {
              this.$refs.marker.mapObject.openPopup()
            })
        }
    }
  }
</script>

<style>
#main-card {
    overflow: hidden;
    position: relative;
}
#main-map {
    cursor: crosshair;
    overflow: hidden;
}
#main-map:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 0;
    height: 100%;
    z-index: 999;
    background: rgb(255,255,255);
background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 60%);
    transition: .5s width ease-in-out;
}
#main-map.side-open:after {
    width:700px;
}
#informations {
    z-index: 9999;
    position: absolute;
    right: -100%;
    bottom: 0;
    transition: bottom .5s ease-in-out;
    -webkit-transition: right .5s ease-in-out;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
#informations.active {
    right: 0;
}
#main-card .v-skeleton-loader > .v-skeleton-loader__bone {
    background-color: transparent !important;
}
.close_card {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    z-index: 1;
}
@media (max-width: 900px) {
    #informations.active {
        width:100% !important;
    }
    #main-map:after {
        background-color: rgba(255, 255, 255, 0.8) !important;
        background: inherit;
    }
    #main-map.side-open:after {
        width:100%;
    }
}
</style>
