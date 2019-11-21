export default {
    namespaced: true,
    state: {
        uploadedFileContent: null,
        uploadedFile: null,
        GHPayload: {}
    },
    getters: {
        getUploadedFileContent: state => {
            return state.uploadedFileContent;
        },
        getUploadedFile: state => {
            return state.uploadedFile;
        },
        getGHPayload: state => {
            return state.GHPayload;
        },
    },
    actions: {
        setUploadedFileContent: ({commit}, payload) => {
            commit('setUploadedFileContent', payload);
        },
        setUploadedFile: ({commit}, payload) => {
            commit('setUploadedFile', payload);
        },
        setGHPayload: ({commit}, payload) => {
            commit('setGHPayload', payload);
        }
    },
    mutations: {
        setUploadedFileContent: (state, value) => {
            state.uploadedFileContent = value;
        },
        setUploadedFile: (state, value) => {
            state.uploadedFile = value;
        },
        setGHPayload: (state, value) => {
            state.GHPayload = value;
        }
    }
};