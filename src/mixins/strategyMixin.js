import store from '../store'
import githubService from "@/services/githubService";
import taigaService from "@/services/taigaService";

export const strategyMixin = {
    data() {
        return {
            StrategyManager: class StrategyManager {
                constructor(caller) {
                    if (caller === process.env.VUE_APP_CALLER_TAIGA) {
                        this.strategy = new TaigaStrategy();
                    } else if (caller === process.env.VUE_APP_CALLER_GITHUB) {
                        this.strategy = new GitHubStrategy();
                    }
                }
            }
        }
    }
};

class TaigaStrategy {
    constructor() {
        this.serviceGetter = taigaService.getBoardList;
        this.resultGetter = taigaService.getAnalysisResults;
        // this value is used to query the Taiga API for board details
        this.entityKeyName = "slug";
    }

    setVerified(value) {
        store._mutations["taigaCredentialStore/setVerified"][0](value)
    }

    getVerified() {
        return store.getters["taigaCredentialStore/getVerified"]
    }

    setSelectedEntities(value) {
        store._mutations["boardDataStore/setSelectedBoards"][0](value)
    }

    getSelectedEntities() {
        return store.getters["boardDataStore/getSelectedBoards"]
    }

    setEntityList(value) {
        store._mutations["boardDataStore/setBoardList"][0](value)
    }

    getEntityList() {
        return store.getters["boardDataStore/getBoardList"]
    }

    getUser() {
        return store.getters["taigaCredentialStore/getUserId"]
    }

    getToken() {
        return store.getters["taigaCredentialStore/getAuthToken"]
    }

    getAnalysisRequested() {
        return store.getters["centralStore/getTGAnalysisRequested"];
    }

    setAnalysisRequested(value) {
        store._mutations["centralStore/setTGAnalysisRequested"][0](value);
    }

    prepareRenderPropData(response) {
        return {
            userIcon: "mdi-github-circle",
            entityIcon: "mdi-source-branch",
            sourceIcon: "mdi-source-repository-multiple",
            data: response,
            renderData: {}
        };
    }
}


class GitHubStrategy {
    constructor() {
        this.serviceGetter = githubService.getRepositoriesFromGitHub;
        this.resultGetter = githubService.getAnalysisResults;
        // this value is used to query the GitHub API for repository details
        this.entityKeyName = "name";
    }

    setVerified(value) {
        store._mutations["githubCredentialStore/setVerified"][0](value)
    }

    getVerified() {
        return store.getters["githubCredentialStore/getVerified"]
    }

    setSelectedEntities(value) {
        store._mutations["repositoryDataStore/setSelectedRepositories"][0](value)
    }

    getSelectedEntities() {
        return store.getters["repositoryDataStore/getSelectedRepositories"]
    }

    setEntityList(value) {
        store._mutations["repositoryDataStore/setRepositoryList"][0](value)
    }

    getEntityList() {
        return store.getters["repositoryDataStore/getRepositoryList"]
    }

    getUser() {
        return store.getters["githubCredentialStore/getUsername"]
    }

    getToken() {
        return store.getters["githubCredentialStore/getToken"]
    }

    getAnalysisRequested() {
        return store.getters["centralStore/getGHAnalysisRequested"];
    }

    setAnalysisRequested(value) {
        store._mutations["centralStore/setGHAnalysisRequested"][0](value);
    }

    prepareRenderPropData(response) {
        let meta = {
            userIcon: "mdi-github-circle",
            entityIcon: "mdi-source-branch",
            sourceIcon: "mdi-source-repository-multiple",
            data: response,
            renderData: {}
        };
        // create a deep copy of meta.data
        let localData = JSON.parse(JSON.stringify(meta.data));
        // for each repository in the response
        for (let source of Object.keys(localData)) {
            // remove the "pr_details", "start_date" and "end_date" keys
            delete localData[source]["pr_details"];
            delete localData[source]["start_date"];
            delete localData[source]["end_date"];
            // remove "error" and "failed"
            if (localData[source].hasOwnProperty("error"))
                delete localData[source]["error"];
            if (localData[source].hasOwnProperty("failed"))
                delete localData[source]["failed"];
            if (localData[source].hasOwnProperty("repo_name"))
                delete localData[source]["repo_name"];
            if (localData[source].hasOwnProperty("step"))
                delete localData[source]["step"];
        }
        return meta;
    }
}
