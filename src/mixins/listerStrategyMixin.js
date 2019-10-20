import store from '../store'
import githubService from "@/services/githubService";
import taigaService from "@/services/taigaService";

export const listerStrategyMixin = {
   data() {
       return {
           StrategyManager: class StrategyManager {
               constructor (caller) {
                   if (caller === process.env.VUE_APP_CALLER_TAIGA) {
                       this.strategy = new TaigaStrategy();
                   } else if (caller === process.env.VUE_APP_CALLER_GITHUB) {
                       this.strategy = new GitHubStrategy();
                   }
               }
           }
       }
   }
}

class TaigaStrategy {
    constructor () {
        this.serviceGetter = taigaService.getBoardList;
    }
    setVerified (value) {
        store._mutations["taigaCredentialStore/setVerified"][0](value)
    }
    getVerified () {
        return store.getters["taigaCredentialStore/getVerified"]
    }
    setSelectedEntities (value) {
        store._mutations["boardDataStore/setSelectedBoards"][0](value)
    }
    getSelectedEntities () {
        return store.getters["boardDataStore/getSelectedBoards"]
    }
    setEntityList (value){
        store._mutations["boardDataStore/setBoardList"][0](value)
    }
    getEntityList () {
        return store.getters["boardDataStore/getBoardList"]
    }
    getUser () {
        return store.getters["taigaCredentialStore/getUserId"]
    }
    getToken () {
        return store.getters["taigaCredentialStore/getAuthToken"]
    }
}

class GitHubStrategy {
    constructor () {
        this.serviceGetter = githubService.getRepositoriesFromGitHub;
    }
    setVerified (value) {
        store._mutations["githubCredentialStore/setVerified"][0](value)
    }
    getVerified () {
        return store.getters["githubCredentialStore/getVerified"]
    }
    setSelectedEntities (value) {
        store._mutations["repositoryDataStore/setSelectedRepositories"][0](value)
    }
    getSelectedEntities () {
        return store.getters["repositoryDataStore/getSelectedRepositories"]
    }
    setEntityList (value){
        store._mutations["repositoryDataStore/setRepositoryList"][0](value)
    }
    getEntityList () {
        return store.getters["repositoryDataStore/getRepositoryList"]
    }
    getUser () {
        return store.getters["githubCredentialStore/getUsername"]
    }
    getToken () {
        return store.getters["githubCredentialStore/getToken"]
    }
}
