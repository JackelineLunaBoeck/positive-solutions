<template>
<div>
<v-toolbar dense class="header">



    <v-img
    class="mr-3"
  :src="require('@/assets/logo.png')"
  max-height="350"
  max-width="200"
></v-img>   

    <v-spacer></v-spacer>

</v-toolbar>

</div>
</template>
<style>
.v-toolbar--dense .v-toolbar__content, .v-toolbar--dense .v-toolbar__extension{
background-color:#669A33;
}
.v-application .deep-purple.accent-4{
    background-color:#1E2928 !important;
}

.v-image__image--preload {
    filter: blur(3px) !important;
}

.theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
    color: white !important;
}
.v-list-item__content {
    color:black !important;
}

</style>