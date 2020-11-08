import Vue from "vue";
import Vuex from "vuex";
import { auth } from "@/components/firebase";
import router from "@/router";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    usuario: ""
  },
  mutations: {
    nuevoUsuario(state, payload) {
      if (payload === null) {
        state.usuario = "";
      } else {
        state.usuario = payload;
      }
    }
  },
  getters: {
    isLoggedIn: state => state.usuario
  },
  actions: {
    setUsuario({ commit }, user) {
      const usuario = {
        email: user.email
      };
      commit("nuevoUsuario", usuario);
    },
    cerrarSesion({ commit }) {
      auth.signOut();
      commit("nuevoUsuario", null);
      router.push({ name: "Login" });
    }
  }
});