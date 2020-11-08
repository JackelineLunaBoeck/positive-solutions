<template>
    <v-navigation-drawer
      class="deep-purple accent-4 white--text"
      app
      clipped
      permanent
    >
     <v-list-item class="px-2">
        <v-list-item-title>Bienvenido {{$store.state.usuario.email}}</v-list-item-title>
      </v-list-item>
    <v-list nav dense>
    <div v-for="item in items" :key="item.title"  class="white--text">
        <v-list-tile
            v-if="!item.opciones"
            :key="item.title"
            avatar
            class="v-list-item white--text"

            
        >
            <v-list-tile-action >
                <v-icon >{{ item.icon }}</v-icon>
            </v-list-tile-action>

            <v-list-tile-title v-text="item.title" />
        </v-list-tile>

        <v-list-group
            v-else
            :key="item.title"
            :prepend-icon="item.icon"
            :value="false"
            no-action
            active-class="white--text"
            color="white"
        >
            <template v-slot:activator>
                  <v-list-item-title class="white--text">{{ item.title }}</v-list-item-title>
             </template>

           <v-list-item
                v-for="element in item.opciones"
                :key="element.title"
                :to="element.referencia"
                class="white--text"
            >
                <v-list-tile-title v-text="element.title" class="white--text" />
            </v-list-item>
        </v-list-group>
    </div>
</v-list>
       <template v-slot:append>
        <div class="pa-2"  @click="logout">
          <v-btn block justify-end tile color="#5EA32A" class="white--text">
            Cerrar Sesion
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
</template>
<script>

  import { db } from "@/components/firebase.js";
  export default {
    data: () => ({
          items: []
    }),
    created() {
            let parent = db.collection('modulos')
            parent.get().then(snapshot => {
              this.items = [];
              snapshot.forEach(doc => {
                let item = [];
                let child = parent.doc(doc.id).collection("opciones")
                child.get().then(snapshot => {
                  snapshot.forEach(doc => {
                  item.push({
                    key: doc.id,
                    title: doc.data().nombre,
                    referencia: doc.data().referencia
                  })
                })
              })
                this.items.push({
                        key: doc.id,
                        title: doc.data().nombre,
                        icon: doc.data().icon,
                        opciones: item
                })
              })
          })
    },
    methods: {
        logout(){
          this.$store.dispatch("cerrarSesion");
        }
    }
  }
</script>