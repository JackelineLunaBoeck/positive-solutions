<template>
<div>
<v-data-table
    :headers="headers"
    :items="productos"
    :key="productos.key"
    sort-by="nombre"
    class="elevation-1"
  >
  <template v-slot:item.imagen="{ item }">
            <div class="p-2">
              <v-img :src="item.imagen" 
              max-height="150"
              max-width="250"></v-img>
            </div>
   </template>
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
        <upload-files ref="upload"></upload-files>
      <ValidationProvider name="Stock" rules="required|numeric" v-slot="{ errors }">
        <v-text-field
          v-model="producto.sku"
          label="SKU"
          :error-messages="errors"
        ></v-text-field>
        </ValidationProvider>
        <ValidationProvider name="Stock" rules="required" v-slot="{ errors }">
        <v-text-field
          v-model="producto.nombre_producto"
          label="Nombre Producto"
          :error-messages="errors"
        ></v-text-field>
         </ValidationProvider>
        <v-select
          :items="categorias"
          item-text="nombre"
          item-value="key"
          v-model="selectCategoria"
          label="Categorias"
          placeholder="Seleccione una Categoria"
          filled
          required
        >
        </v-select>
        <v-text-field
          v-model="producto.descripcion"
          label="Descripcion"
        ></v-text-field>
        <ValidationProvider name="Precio" rules="required|decimal" v-slot="{ errors }">
        <v-text-field
          v-model="producto.precio_venta"
          label="Precio"
          :error-messages="errors"
          type="number"
        ></v-text-field>
        </ValidationProvider>
        <ValidationProvider name="Stock" rules="required|numeric" v-slot="{ errors }">
        <v-text-field
          v-model="producto.stock"
          label="Stock"
          :error-messages="errors"
          type="number"
        ></v-text-field>
        </ValidationProvider>
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
import { required, max, numeric } from 'vee-validate/dist/rules'
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
import { db } from "@/components/firebase.js";
import UploadFiles from "@/components/UploadFiles";

const SUCCESS=0, FAILLURE=1 
  setInteractionMode('eager');

  extend('required', {
    ...required,
    message: '{_field_} No puede estar vacio',
  })

  extend('numeric', {
    ...numeric,
    message: '{_field_} Debe ingresar un numero',
  })

   extend('max', {
    ...max,
    message: '{_field_} no puede exceder mas de {length} caracteres',
  })

  extend("decimal", {
  validate: (value, { decimals = '*', separator = '.' } = {}) => {
    if (value === null || value === undefined || value === '') {
      return {
        valid: false
      };
    }
    if (Number(decimals) === 0) {
      return {
        valid: /^-?\d*$/.test(value),
      };
    }
    const regexPart = decimals === '*' ? '+' : `{1,${decimals}}`;
    const regex = new RegExp(`^[-+]?\\d*(\\${separator}\\d${regexPart})?([eE]{1}[-]?\\d+)?$`);

    return {
      valid: regex.test(value),
    };
  },
  message: 'Debe ingresar un precio valido'
})

  export default {
    data () {
      return {
          dialogDelete: false,
          headers: [
          { text: 'Imagen', value: 'imagen' },
          { text: 'SKU', value: 'sku' },
          {
            text: 'Nombre',
            align: 'start',
            sortable: false,
            value: 'nombre_producto',
          },
          { text: 'Precio', value: 'precio_venta' },
          { text: 'Existencias', value: 'stock' },
          { text: 'Actions', value: 'actions', sortable: false },
        ],
          productos:[],
          categorias:[],
          selectCategoria:null,
          producto:{imagen:'',sku:'',nombre_producto:'',descripcion:'',precio_venta:'',stock:'', categoria:''},
          editProducto: '',
          message: {status: SUCCESS, text:''}
          
    }
    },
     components: {
      ValidationProvider,
      ValidationObserver,
      UploadFiles,
    },
    created() {
            /******************LLENAMOS LA TABLA********************/
            db.collection('productos').onSnapshot((snapshotChange) => {
                this.productos = [];
                snapshotChange.forEach((doc) => {
                    this.productos.push({
                        key: doc.id,
                        imagen: doc.data().imagen,
                        sku: doc.data().sku,
                        nombre_producto: doc.data().nombre_producto,
                        descripcion: doc.data().descripcion,
                        precio_venta: doc.data().precio_venta,
                        stock: doc.data().stock,
                        categoria: doc.data().categoria
                    })
                })
            })

            db.collection("categorias").onSnapshot((snapshotChange) => {
                snapshotChange.forEach(doc => {
                  this.categorias.push({
                    key:doc.id,
                    ...doc.data()
                    })

                })
            })
        },

      methods: {
            /**********************GUARDAMOS INFORMACION*********************/
            onFormSubmit() {
                this.producto.imagen = this.$refs.upload.img1
                this.producto.categoria = this.selectCategoria
                event.preventDefault()
                if(this.editProducto==''){
                db.collection('productos').add(this.producto).then(() => { 
                  this.message.status=SUCCESS
                  this.message.text='Registro guardado con exito!';                   
                }).catch((error) => {
                    this.message.status=FAILLURE
                    this.message.text=error;
                });
              }
              else{
                db.collection('productos').doc(this.editProducto)
                .update(this.producto).then(() => {
                    this.message.status=SUCCESS
                    this.message.text='Registro actualizado con exito!';
                }).catch((error) => {
                    this.message.status=FAILLURE
                    this.message.text=error;
                });
              }
              this.clear()   
            },

            editItem(item) {
              this.producto = Object.assign({}, item)
              this.$refs.upload.img1 = this.producto.imagen
              this.selectCategoria = this.producto.categoria
              this.editProducto = this.producto.key
            },

            deleteItem (item) {
              this.editProducto = item.key
              this.dialogDelete = true
            },
            deleteItemConfirm () {
               db.collection("productos").doc(this.editProducto).delete().then(() => {
                    this.message.status=SUCCESS
                    this.message.text="Registro eliminado con exito!";
                })
                .catch((error) => {
                    this.message.status=FAILLURE
                    this.message.text=error;
                })
              this.closeDelete()
              },
            closeDelete () {
              this.dialogDelete = false
              this.editProducto = ''
            },
            clear(){
               this.producto = Object.assign({}, [])
               this.editProducto=''
               this.$refs.upload.img1 = ''
               this.$refs.upload.caption = ''
               this.selectCategoria = null
            }
        },
      
  }
</script>
