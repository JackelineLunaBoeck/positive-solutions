<template>
<div>
<v-data-table
    :headers="headers"
    :items="datagrid"
    :key="datagrid.key"
    sort-by="nombre"
    class="elevation-1"
  >
<template v-slot:top>
  <validation-observer
    ref="observer"
    v-slot="{ invalid }"
  >
  <form @submit.prevent="onFormSubmit" style="padding:12px">
  <v-alert
      border="top"
      dark
      v-if="message.text!=''"
      color="indigo"
    >
      {{message.text}}
    </v-alert>
    <v-text-field
          v-model="data.nombre"
          label="Nombre"
          required
    ></v-text-field>
    <v-text-field
          v-model="data.nit"
          label="NIT"
          required
    ></v-text-field>
    <v-text-field
          v-model="data.direccion"
          label="Direccion"
          required
    ></v-text-field>
    <v-text-field
          v-model="data.telefono"
          label="Telefono"
          required
    ></v-text-field>
    <v-text-field
          v-model="data.email"
          label="Email"
          required
    ></v-text-field>
    <v-btn
        class="mr-4"
        type="submit"
        :disabled="invalid"
      >
        Enviar
      </v-btn>
      <v-btn @click="clear">
        Limpiar
      </v-btn>
  </form>
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
 <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
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
<script>
import FuncionesDB from "../services/functions.js";
import { ValidationObserver} from 'vee-validate'

export default {
    data () {
        return {
            collection:'clientes',
            datagrid:[], //Elemento de Llenado
            data:{}, //Datos del formulario
            current:null, //Guarda elemento a actualizar,
            headers: [
                {
                    text: 'Nombre',
                    align: 'start',
                    sortable: false,
                    value: 'nombre',
                },
                { text: 'NIT', value: 'nit' },
                { text: 'Telefono', value: 'telefono' },
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
    },
    methods: {
        onFormSubmit(){
            event.preventDefault()
            this.message = FuncionesDB.createorupdate(this.collection, this.data, this.current)
            this.clear()
        },
        editItem(item) {
              this.data = Object.assign({}, item)
              this.current = this.data.key
        },
        deleteItem (item) {
              this.current = item.key
              this.dialogDelete = true
        },
        deleteItemConfirm () {
            this.message = FuncionesDB.delete(this.collection, this.current)
            this.current = null
            this.closeDelete()
            this.clear()
        },
        closeDelete () {
              this.dialogDelete = false
        },
        clear(){
               this.datagrid = FuncionesDB.fill(this.collection)
               this.data = Object.assign({}, [])
               this.current=null
        }
    }
}
</script>