export default {
    namespaced: true,
    state: {
        uploadedFileContent: null,
        uploadedFile: null,
        GHPayload: {},
        TGAnalysisRequested: false,
        GHAnalysisRequested: false,
        TGPayload: {}
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
        getGHAnalysisRequested: state => {
            return state.GHAnalysisRequested;
        },
        getTGAnalysisRequested: state => {
            return state.TGAnalysisRequested;
        },
        getTGPayload: state => {
            return state.TGPayload;
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
        },
        setTGPayload: ({commit}, payload) => {
            commit('setTGPayload', payload);
        },
        setGHAnalysisRequested: ({commit}, payload) => {
            commit('setGHAnalysisRequested', payload);
        },
        setTGAnalysisRequested: ({commit}, payload) => {
            commit('setTGAnalysisRequested', payload);
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
        },
        setTGPayload: (state, value) => {
            state.TGPayload = value;
        },
        setTGAnalysisRequested: (state, value) => {
            state.TGAnalysisRequested = value;
        },
        setGHAnalysisRequested: (state, value) => {
            state.GHAnalysisRequested = value;
        }
    }
};