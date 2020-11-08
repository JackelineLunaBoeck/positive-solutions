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
          v-model="data.email"
          label="Email"
          required
    ></v-text-field>
     <v-text-field
          v-model="data.password"
          label="Clave"
          required
          type="password"
    ></v-text-field>
    <v-select
          :items="roles"
          item-text="descripcion"
          item-value="key"
          v-model="selectRol"
          label="Rol"
          placeholder="Seleccione un Rol"
          filled
          required
        >
        </v-select>
    <h3>Permisos</h3>
    <v-flex v-for="permiso in permisos" :key="permiso.id" xs6>
                  <v-checkbox light :label="permiso.text" v-model="permisos.selected">
                  </v-checkbox>
    </v-flex>
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
import FuncionesDB from "../services/functions.js";
import { ValidationObserver} from 'vee-validate'
import { db } from "@/components/firebase.js";
import { auth } from "@/components/firebase.js";

export default {
    data () {
        return {
            collection:'usuarios',
            datagrid:[], //Elemento de Llenado
            data:{}, //Datos del formulario
            current:null, //Guarda elemento a actualizar,

            //elemento header de llenado
            headers: [
                {
                    text: 'Email',
                    align: 'start',
                    sortable: false,
                    value: 'email',
                },
                { text: 'Acciones', value: 'actions', sortable: false },
            ],
            message: {status: 0, text:''}, //mensajes
            dialogDelete: false, //propiedad del cuadro de dialogo
            roles:[],
            selectRol:null,
        }
    },
    components: {
      ValidationObserver
    },
    created() {
         this.datagrid= []
         this.datagrid = FuncionesDB.fill(this.collection)

         db.collection("roles").onSnapshot((snapshotChange) => {
                snapshotChange.forEach(doc => {
                  this.roles.push({
                    key:doc.id,
                    ...doc.data()
                    })

                })
         })
    },
    methods: {
        onFormSubmit(){
            event.preventDefault()

            this.data.rol = this.selectRol
            auth.createUserWithEmailAndPassword(this.data.email, this.data.password)
            .then(() => {
           })
            .catch(() => {
            });

            this.message = FuncionesDB.createorupdate(this.collection, this.data, this.current)
            this.clear()
        },
        editItem(item) {
              this.data = Object.assign({}, item)
              this.roles = this.data.rol
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
               this.datagrid = FuncionesDB.fill(this.collection)
               this.data = Object.assign({}, [])
               this.current=null
        },
        imprimir(){
            let h = [
                {title: "Email", dataKey: "email"}
            ];
            FuncionesDB.report('Usuarios', 'Lista de Usuarios', h, this.datagrid)
        }
    }
}
</script>