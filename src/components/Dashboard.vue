<template>
<div>
<v-app>
  <Header/>
    <v-row no-gutters>
    <v-col>
    <Nav />
 </v-col>
 <v-col md="12">
 <v-card
  >
  <router-view/>
 </v-card>
      </v-col>
    </v-row>
<Footer />
</v-app>
</div>
</template>
<script>
import { mapState } from "vuex";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Nav from "@/components/Nav";

export default {
  computed: {
    ...mapState(["usuario"])
  },
   components: {
        Footer,
        Header,
        Nav,
    },
};
</script>