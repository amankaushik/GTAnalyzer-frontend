import Vue from 'vue'
import Vuex from 'vuex'
import credentialStore from "@/store/credentialStore";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {},
    modules: {
        credentialStore
    },
})
