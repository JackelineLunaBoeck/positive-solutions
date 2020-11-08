<template>
<div>
<div v-if="img1!=''">                     
          <img class="preview" height="268" width="356" :src="img1">
       <br>
</div>
<v-container>
  <v-row>
  <v-col md="2">
            <input type="file" ref="file"
                style="display: none"
                accept="image/*"> 
                <v-btn @click="searchFile">Elige una imagen</v-btn>
  </v-col>
  <v-col md="7">
           <v-text-field
            solo
            v-model="caption"
            label="Nombre de la imagen">
            </v-text-field>
  </v-col>
  <v-col md="3">
           <v-btn color="pink" @click="previewImage">upload</v-btn>
  </v-col>
             
  </v-row>
</v-container>
</div> 
</template>


<script>
import { storage } from "@/components/firebase.js";
export default {
  data () {
    return {
      caption : '',
      img1: '',
      imageData: null
    }
  },
  methods: {
    searchFile() {
        this.$refs.file.click()
    },
    previewImage() {
        this.uploadValue=0;
        this.img1=null;
        this.imageData = this.$refs.file.files[0];
        this.onUpload()
    },
    onUpload(){
        this.img1=null;
        const storageRef=storage.ref(this.caption).put(this.imageData)
        storageRef.on(`state_changed`,snapshot=>{
            this.uploadValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
        }, error=>{console.log(error.message)},
        ()=>{this.uploadValue=100;
        storageRef.snapshot.ref.getDownloadURL().then((url)=>{
          this.img1 =url;
         });
        }      
    )
 },
  }
}
</script>