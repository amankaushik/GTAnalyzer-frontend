export default {
    namespaced: true,
    state: {
        repositoryList: [],
        selectedRepositories: [],
    },
    getters: {
        getRepositoryList: state => {
            return state.repositoryList;
        },
        getSelectedRepositories: state => {
            return state.selectedRepositories
        }
    },
    actions: {
        setRepositoryList: ({commit}, payload) => {
            commit('setRepositoryList', payload);
        },
        setSelectedRepositories: ({commit}, payload) => {
            commit('setSelectedRepositories', payload);
        }
    },
    mutations: {
        setRepositoryList: (state, value) => {
            state.repositoryList = value;
        },
        setSelectedRepositories: (state, value) => {
            state.selectedRepositories = value;
        }
    }
};