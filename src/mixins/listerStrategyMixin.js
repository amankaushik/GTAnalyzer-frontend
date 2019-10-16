import store from '../store'

export const listerStrategyMixin = {
   data() {
       return {
           StrategyManager: class StrategyManager {
               constructor (caller) {
                   if (caller === "taiga") {
                       this.strategy = new TaigaStrategy();
                   } else if (caller === "github") {
                       this.strategy = new GitHubStrategy();
                   }
               }
           }
       }
   }
}

class TaigaStrategy {
    setVerified (value) {
        store._mutations["taigaCredentialStore/setVerified"][0](value)
    }
    getVerified () {
        return store.getters['"taigaCredentialStore/getVerified"']
    }
    setSelectedEntities (value) {
        store._mutations["boardDataStore/setSelectedBoards"][0](value)
    }
    getSelectedEntities () {
        return store.getters['"boardDataStore/getSelectedBoards"']
    }
    setEntityList (value){
        store._mutations["boardDataStore/setBoardList"][0](value)
    }
    getEntityList () {
        return store.getters['"boardDataStore/getBoardList"']
    }
}

class GitHubStrategy {
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
}
