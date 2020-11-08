<template>
  <v-container>
    <v-layout row class="justify-center">
    <v-card flat>
     <v-alert
      dense
      outlined
      type="error"
      v-if="error"
    >
    {{error}}
    </v-alert>
            <v-card-title primary-title>
              <h4>Login</h4>
            </v-card-title>
            <v-form @submit.prevent="submit">
            <v-text-field name="email" label="Email" type="email" value required autofocus v-model="form.email"></v-text-field>
            <v-text-field name="password" label="Password" type="password" required v-model="form.password"></v-text-field>
            <v-card-actions>
              <v-btn primary large block type="submit">Login</v-btn>
            </v-card-actions>
            </v-form>
          </v-card>
    </v-layout>
  </v-container>
</template>
<script>
import { auth } from "@/components/firebase.js";

export default {
  data() {
    return {
      form: {
        email: "",
        password: ""
      },
      error: null
    };
  },
  methods: {
    submit() {
      auth
        .signInWithEmailAndPassword(this.form.email, this.form.password)
        .then(() => {
          this.$router.replace({ name: "Dashboard" });
        })
        .catch(err => {
          this.error = err.message;
        });
    }
  }
};
</script>