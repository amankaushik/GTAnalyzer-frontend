import Vue from 'vue'
import Vuex from 'vuex'
import githubCredentialStore from "@/store/githubCredentialStore";
import taigaCredentialStore from "@/store/taigaCredentialStore";
import repositoryDataStore from "@/store/repositoryDataStore";
import boardDataStore from "@/store/boardDataStore";
import centralStore from "@/store/centralStore";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {},
    modules: {
        githubCredentialStore,
        taigaCredentialStore,
        repositoryDataStore,
        boardDataStore,
        centralStore
    },
})
