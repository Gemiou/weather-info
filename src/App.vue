<template>
    <v-app>
        <v-content class="justify-center align-center">
            <v-card
                class="mx-auto"
                max-width="80vw"
              >
                <v-list-item>
                    <v-list-item-avatar color="white">
                        <img
                            src="logo.png"
                        >
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title class="headline">Weather Map</v-list-item-title>
                        <v-list-item-subtitle>Click on any location to get Temperature and Humidity informations</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <Map/>
            </v-card>
        </v-content>
    </v-app>
</template>

<script>
import Map from './components/Map';

export default {
  name: 'App',

  components: {
    Map,
  },

  data: () => ({
    users: '',
    date: new Date().toISOString().substr(0, 10),
    menu2: false,
  }),

  methods: {
    fetchUsers: function () {
        this.$http.get(this.apiURL).then((result) => {
            this.users = result.data
        })
    }
  }
};
</script>
