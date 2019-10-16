export default {
    namespaced: true,
    state: {
        username: null,
        token: null,
        verified: false
    },
    getters: {
        getUsername: state => {
            return state.username;
        },
        getToken: state => {
            return state.token
        },
        getVerified: state => {
            return state.verified
        }
    },
    actions: {
        setToken: ({commit}, payload) => {
            commit('setToken', payload);
        },
        setUsername: ({commit}, payload) => {
            commit('setUsername', payload);
        },
        setVerified: ({commit}, payload) => {
            commit('setVerified', payload);
        }
    },
    mutations: {
        setToken: (state, value) => {
            state.token = value;
        },
        setUsername: (state, value) => {
            state.username = value;
        },
        setVerified: (state, value) => {
            state.verified = value;
        }
    }
};