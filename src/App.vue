<template>
    <v-app>
        <v-content class="justify-center align-center">
            <v-card
                class="mx-auto"
                max-width="80vw"
              >
                <v-card-title class="headline">Weather Map</v-card-title>
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
