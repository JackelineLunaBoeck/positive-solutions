<template>
<div>

<!--llenar tabla grid!-->
<v-data-table
    :headers="headers"
    :items="datagrid"
    :key="datagrid.key"
    sort-by="nombre"
    class="elevation-1"
  >
<!--mostrar arriba!-->
<template v-slot:top>

<!--validar formulario!-->
  <validation-observer
    ref="observer"
    v-slot="{ invalid }"
  >
<!--mostrar  formulario para imprimir!-->
  <form @submit.prevent="onFormSubmit" style="padding:12px">
    <v-btn
      color="primary"
      depressed
      @click="imprimir"
    >
<!--boton icono imprimir-->
      <v-icon left>
        mdi-printer
      </v-icon>
      Imprimir
    </v-btn>


<!--mensaje de exito-->
  <v-alert
      border="top"
      dark
      v-if="message.text!=''"
      color="indigo"
    >
      {{message.text}}
    </v-alert>
<!--tomar data -->
    <v-text-field
          v-model="data.descripcion"
          label="Descripcion"
          required
    ></v-text-field>
    <v-layout row wrap>
      <v-flex v-for="(modulo,id) in modulos" :key="modulos[id].text" xs6>
          <v-checkbox light :label="modulo.nombre" v-model="modulo.selected">
          </v-checkbox>
      </v-flex>
     </v-layout>
<!--boton enviar -->
    <v-btn
        class="mr-4"
        type="submit"
        :disabled="invalid"
      >
        Enviar
      </v-btn>
<!--boton limpiar -->
      <v-btn @click="clear">
        Limpiar
      </v-btn>
  </form>

  <!--validacion de borrado -->
  </validation-observer>
   <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">¿Esta seguro que desea borrar este elemento?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
    </v-dialog>
</template>

<!--seccion de acciones edit-delete -->
 <template v-slot:item.actions="{ item }">
 <!--ejecutar evento editItem -->
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
 <!--ejecutar evento deleteItem -->
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
</v-data-table>
</div>
</template>

<!--************************SCRIPTS************************!-->
<script>
import { db } from "@/components/firebase.js";
import FuncionesDB from "../services/functions.js";
import { ValidationObserver} from 'vee-validate'

export default {
    data () {
        return {
            collection:'roles',
            datagrid:[], //Elemento de Llenado
            data:{}, //Datos del formulario
            current:null, //Guarda elemento a actualizar,
            modulos:[],
            //elemento header de llenado
            headers: [
                {
                    text: 'Descripcion',
                    align: 'start',
                    sortable: false,
                    value: 'descripcion',
                },
                { text: 'Acciones', value: 'actions', sortable: false },
            ],
            message: {status: 0, text:''}, //mensajes
            dialogDelete: false //propiedad del cuadro de dialogo
        }
    },
    components: {
      ValidationObserver
    },
    created() {
         this.datagrid= []
         this.datagrid = FuncionesDB.fill(this.collection)

         
         db.collection("modulos").onSnapshot((snapshotChange) => {
                snapshotChange.forEach(doc => {
                  this.modulos.push({
                    key:doc.id,
                    nombre: doc.data().nombre,
                    selected:false
                    })

                })
         })
    },
    methods: {
        onFormSubmit(){
            event.preventDefault()
            this.data.permisos = this.modulos
            this.message = FuncionesDB.createorupdate(this.collection, this.data, this.current)
            this.clear()
        },
        editItem(item) {
              this.data = Object.assign({}, item)
              this.modulos = this.data.permisos
              this.current = this.data.key
        },
        deleteItem (item) {
              this.current = item.key
              this.dialogDelete = true
        },
        deleteItemConfirm () {
            this.message = FuncionesDB.delete(this.collection, this.current)
            this.closeDelete()
            this.clear()
        },
        closeDelete () {
              this.dialogDelete = false
              this.current = null
        },
        clear(){
              
               this.modulos.forEach((modulo)=>{
                  modulo.selected = false
               })
               this.datagrid = FuncionesDB.fill(this.collection)
               this.data = Object.assign({}, [])
               this.current=null
        },
        imprimir(){
            let h = [
                {title: "Descripcion", dataKey: "descripcion"}
            ];
            FuncionesDB.report('Roles', 'Lista de Roles', h, this.datagrid)
        }
    }
}
</script>