export default {
    namespaced: true,
    state: {
        uploadedFileContent: null,
        uploadedFile: null
    },
    getters: {
        getUploadedFileContent: state => {
            return state.uploadedFileContent;
        },
        getUploadedFile: state => {
            return state.uploadedFile;
        }
    },
    actions: {
        setUploadedFileContent: ({commit}, payload) => {
            commit('setUploadedFileContent', payload);
        },
        setUploadedFile: ({commit}, payload) => {
            commit('setUploadedFile', payload);
        }
    },
    mutations: {
        setUploadedFileContent: (state, value) => {
            state.uploadedFileContent = value;
        },
        setUploadedFile: (state, value) => {
            state.uploadedFile = value
        }
    }
};