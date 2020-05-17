<template>
    <v-card
    elevation="0"
    id="main-card"
    >
        <l-map
          style="height: 80vh"
          v-bind:class="{ 'side-open': dataCard }"
          :zoom="zoom"
          :center="currentPosition"
          @click="getLocation"
          id="main-map"
        >

            <l-tile-layer :url="url"/>
            <l-marker :lat-lng="currentPosition" ref="marker"></l-marker>

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
                >
                    <v-list-item two-line>
                        <v-list-item-content>
                            <v-list-item-title class="headline">{{locationName}}</v-list-item-title>
                            <v-list-item-subtitle>Mon, 12:30 PM, Mostly sunny</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>

                    <v-card-text>
                        <v-row align="center">
                            <v-col class="display-3" cols="6">
                            23&deg;C
                            </v-col>
                            <v-col cols="6">
                                <v-img
                                src="https://cdn.vuetifyjs.com/images/cards/sun.png"
                                alt="Sunny image"
                                width="92"
                                ></v-img>
                            </v-col>
                        </v-row>
                    </v-card-text>

                    <v-list-item>
                        <v-list-item-icon>
                            <v-icon>mdi-send</v-icon>
                        </v-list-item-icon>
                        <v-list-item-subtitle>23 km/h</v-list-item-subtitle>
                    </v-list-item>

                    <v-list-item>
                        <v-list-item-icon>
                            <v-icon>mdi-cloud-download</v-icon>
                        </v-list-item-icon>
                        <v-list-item-subtitle>48%</v-list-item-subtitle>
                    </v-list-item>

                    <v-slider
                    v-model="time"
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
                            <v-list-item-title>{{ item.day }}</v-list-item-title>

                            <v-list-item-icon>
                                <v-icon>{{ item.icon }}</v-icon>
                            </v-list-item-icon>

                            <v-list-item-subtitle class="text-right">
                                {{ item.temp }}
                            </v-list-item-subtitle>
                        </v-list-item>
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
        currentPosition: latLng(40.6010983, 22.880733),
        showMap: true,
        showData: true,
        labels: ['ΔΕ', 'ΤΡ', 'ΤΕ', 'ΠΕ', 'ΠΑ', 'ΣΑ', 'ΚΥ'],
        time: 0,
        dataCard: false,
        forecast: [
          { day: '08:00', icon: 'mdi-white-balance-sunny', temp: '24\xB0/12\xB0' },
          { day: '09:00', icon: 'mdi-white-balance-sunny', temp: '22\xB0/14\xB0' },
          { day: '10:00', icon: 'mdi-cloud', temp: '25\xB0/15\xB0' },
          { day: '11:00', icon: 'mdi-cloud', temp: '25\xB0/15\xB0' },
        ],
    }),
    methods: {
        getLocation(map) {

            this.$http.get('https://nominatim.openstreetmap.org/reverse?format=json&lat='+map.latlng.lat+'&lon='+map.latlng.lng).then((result) => {
                if (result.data.address.suburb) {
                    this.locationName = result.data.address.suburb
                } else if (result.data.address.city) {
                    this.locationName = result.data.address.city
                } else if (result.data.address.village) {
                    this.locationName = result.data.address.village
                } else {
                    this.locationName = result.data.address.town
                }
            })

            this.$http.get(this.apiURL).then((result) => {
                console.log(result)
            })

            var self = this;
            self.loading = true
            setTimeout(function(){
                self.loading = false
            }, 2000);
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
    width: 0%;
    height: 100%;
    z-index: 999;
    background: rgb(255,255,255);
background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 60%);
    transition: .5s width ease-in-out;
}
#main-map.side-open:after {
    width:40%;
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
</style>
