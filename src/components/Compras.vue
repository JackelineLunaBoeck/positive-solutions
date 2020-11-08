<template>
<div>
 <v-card
  >
    <v-card-title>Encabezado</v-card-title>
    <v-card-text>
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
          v-model="data.no_comprobante"
          label="Doc. Compra"
          required
    ></v-text-field>
    Fecha<br/>
    <v-date-picker
      locale="en-in"
      v-model="data.fecha"
      no-title
    >
    </v-date-picker><br/>
    <v-container style="margin:0;padding:0">
    <v-row>
    <v-col md="3">
    <v-text-field
          v-model="data_det.sku"
          label="NIT"
          required
          disabled="true"
    ></v-text-field>
     </v-col>
     <v-col md="6">
    <v-btn
    color="success"
    fab
    small
    dark
    @click="cargarProveedor"
    >
   <v-icon>mdi-database</v-icon>
    </v-btn>
     </v-col>
  </v-row>
  </v-container>
  
    <v-text-field
            v-model="totalProductos"
            label="precio"
            outlined
            disabled
          ></v-text-field><br/>
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
</v-card-text>
</v-card>
 <v-card v-if="current">
 <v-card-title>Detalle</v-card-title>
 <v-card-text>
 </v-card-text>
 <v-data-table
    :headers="headers_det"
    :items="datagrid_det"
    :key="datagrid_det.key"
    class="elevation-1"
  >
  <template v-slot:top>

  <validation-observer
    ref="observer"
    v-slot="{ invalid }"
  >
  <form @submit.prevent="onFormSubmit_det" style="padding:12px">
  <v-alert
      border="top"
      dark
      v-if="message.text!=''"
      color="indigo"
    >
      {{message.text}}
    </v-alert>
  <v-container style="margin:0;padding:0">
    <v-row>
    <v-col md="3">
    <v-text-field
          v-model="data_det.sku"
          label="SKU"
          required
          disabled="true"
    ></v-text-field>
     </v-col>
     <v-col md="6">
    <v-btn
    color="success"
    fab
    small
    dark
    @click="cargarProducto"
    >
   <v-icon>mdi-database</v-icon>
    </v-btn>
     </v-col>
  </v-row>
  </v-container>
  <v-dialog
      v-model="dialogProductos"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
    <v-card>
    <v-toolbar
          dark
          color="primary"
        >
          <v-btn
            icon
            dark
            @click="dialogProductos = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Cargar Producto</v-toolbar-title>
        </v-toolbar>
              <v-text-field
                label="Nombre"
                v-model='whereproducto.nombre'
                @change="buscar"
              ></v-text-field>
         <v-data-table
          :headers="headersProductos"
          :items="datagridProductos"
          :key="datagridProductos.key"
          sort-by="nombre"
          class="elevation-1"
        >
        <template v-slot:item.actions="{ item }">
        <v-icon
        small
        @click="cargarProducto_det(item)"
        >
          mdi-database
        </v-icon>
        </template>
        </v-data-table>
        </v-card>
  </v-dialog>
    <v-text-field
          v-model="data_det.precio"
          label="Precio"
          required
    ></v-text-field>
    <v-text-field
          v-model="data_det.cantidad"
          label="Cantidad"
          required
    ></v-text-field>
    <v-text-field
          v-model="data_det.descuento"
          label="Descuento"
          required
    ></v-text-field>
    <v-btn
        class="mr-4"
        type="submit"
        :disabled="invalid"
      >
        Enviar
      </v-btn>
      <v-btn @click="clear_det">
        Limpiar
      </v-btn>
  </form>
  </validation-observer>
  <v-dialog v-model="dialogDelete_det" max-width="500px">
          <v-card>
            <v-card-title class="headline">¿Esta seguro que desea borrar este elemento?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete_det">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm_det">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
    </v-dialog>
</template>
<template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem_det(item)"
      >
        mdi-pencil
      </v-icon>
    </template>
</v-data-table>
</v-card>
</div>
</template>
<script>
import FuncionesDB from "../services/functions.js";
import { ValidationObserver} from 'vee-validate'
import { db } from "@/components/firebase.js";
export default {
    data () {
        return {
            ///////////ENCABEZADOS/////////////////////////////
            collection:'compras',
            datagrid:[], //Elemento de Llenado
            data:{}, //Datos del formulario
            current:null, //Guarda elemento a actualizar,
            headers: [
                {
                    text: 'Doc. Compra',
                    align: 'start',
                    sortable: false,
                    value: 'no_compra',
                },
                { text: 'Proveedor', value: 'proveedor' },
                { text: 'Fecha', value: 'fecha' },
                { text: 'Acciones', value: 'actions', sortable: false },
            ],
            message: {status: 0, text:''}, //mensajes
            dialogDelete: false, //propiedad del cuadro de dialogo
            totalProductos: 0, //calcula el total de los productos
            //////////////DETALE///////////////////////////////////
            collection_det:'compras_det',
            datagrid_det:[],
            data_det:{},
            current_det:null,
            headers_det: [
                {
                    text: 'Cantidad',
                    align: 'start',
                    sortable: false,
                    value: 'cantidad',
                },
                { text: 'Precio', value: 'precio' },
                { text: 'Descuento', value: 'descuento' },
                { text: 'Acciones', value: 'actions', sortable: false },
            ],
            dialogDelete_det: false,
            productos_det: {},
            //////////////////PRODUCTOS//////////////////////////////////
            dialogProductos: false,
            datagridProductos:[],
            headersProductos:[
                { text: 'SKU', value: 'sku' },
                { text: 'Nombre', value: 'nombre_producto' },
                { text: 'Precio', value: 'precio_venta' },
                { text: 'Existencias', value: 'stock' },
                { text: 'Acciones', value: 'actions', sortable: false },
            ],
            whereproducto:[],
            productoActual:[]
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
        /////////////////METODOS ENCABEZADO//////////////////////////
        onFormSubmit(){
            event.preventDefault()
            this.message = FuncionesDB.createorupdate(this.collection, this.data, this.current)
            this.clear()
        },
        editItem(item) {
              this.data = Object.assign({}, item)
              this.current = this.data.key
              this.totalProductos = 0
              this.datagrid_det = []
              db.collection(this.collection).doc(this.current).collection(this.collection_det)
                .onSnapshot((snapshotChange) => {  
                    snapshotChange.forEach((doc) => {
                        this.datagrid_det.push({
                            key: doc.id,
                            ...doc.data()
                        })
                        this.totalProductos = Number(this.totalProductos) + Number(doc.data().precio) - Number(doc.data().descuento)
                        this.totalProductos = this.totalProductos.toFixed(2)
                    })
                })
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
        },
        /////////////////////METODOS DETALLE//////////////////////
        onFormSubmit_det(){
            event.preventDefault()
            this.message = FuncionesDB.createorupdate(this.collection, this.data_det, this.current, this.collection_det, this.current_det)
             const cantidad = this.data_det.cantidad
             db.collection('productos')
            .where('sku', '==', this.data_det.sku)
            .get()
            .then(snapshotChange => {  
             snapshotChange.forEach((doc) => {
               this.productoActual.id = doc.id
               this.productoActual.cantidad = doc.data().stock
                 db.collection('productos')
            .doc(this.productoActual.id)
            .update({ 'stock': Number(this.productoActual.cantidad)+Number(cantidad) })
            .then(() => {
            })
             })

           
         })
         
              this.clear_det()
        },
        editItem_det(item) {
              this.data_det = Object.assign({}, item)
              this.current_det = this.data_det.key
        },
        deleteItem_det (item) {
              this.current_det = item.key
              this.dialogDelete_det = true
        },
        deleteItemConfirm_det () {
            this.message = FuncionesDB.delete(this.collection, this.current,this.collection_det, this.current_det)
            this.current_det = null
            this.closeDelete_det()
            this.clear_det()
        },
        closeDelete_det () {
              this.dialogDelete_det = false
        },
        clear_det(){
               
               this.data_det = Object.assign({}, [])
               this.current_det=null
               this.datagrid_det = FuncionesDB.fill(this.collection, this.current, this.collection_det)
        },
        ///////////////////////////CARGA DE PRODUCTOS///////////////////////////
        cargarProducto () {
              this.dialogProductos = true
        },
        buscar(){
              this.datagridProductos = []
               db.collection('productos')
               .where('nombre_producto', '>=', this.whereproducto.nombre)
               .where('nombre_producto', '<=', this.whereproducto.nombre + '~')
               .get()
                .then(snapshotChange => {  
                    snapshotChange.forEach((doc) => {
                        this.datagridProductos.push({
                            key: doc.id,
                            ...doc.data()
                        })
                    })
                })
        },
         cargarProducto_det (item) {
           this.data_det.sku = item.sku
           this.data_det.precio = item.precio_venta
           this.dialogProductos = false
        },
    },
}
</script>