import Vue from 'vue'
import Vuex from 'vuex'
import credentialStore from "@/store/credentialStore";
import repositoryDataStore from "@/store/repositoryDataStore";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {},
    modules: {
        credentialStore,
        repositoryDataStore
    },
})
