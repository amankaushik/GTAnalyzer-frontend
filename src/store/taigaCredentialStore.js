export default {
    namespaced: true,
    state: {
        username: null,
        authToken: null,
        userId: null,
        password: null,
        verified: false
    },
    getters: {
        getUsername: state => {
            return state.username;
        },
        getAuthToken: state => {
            return state.authToken
        },
        getVerified: state => {
            return state.verified
        },
        getUserId: state => {
            return state.userId
        },
        getPassword: state => {
            return state.password
        }
    },
    actions: {
        setAuthToken: ({commit}, payload) => {
            commit('setAuthToken', payload);
        },
        setUsername: ({commit}, payload) => {
            commit('setUsername', payload);
        },
        setVerified: ({commit}, payload) => {
            commit('setVerified', payload);
        },
        setUserId: ({commit}, payload) => {
            commit('setUserId', payload);
        },
        setPassword: ({commit}, payload) => {
            commit('setPassword', payload);
        }
    },
    mutations: {
        setAuthToken: (state, value) => {
            state.authToken = value;
        },
        setUsername: (state, value) => {
            state.username = value;
        },
        setVerified: (state, value) => {
            state.verified = value;
        },
        setUserId: (state, value) => {
            state.userId = value
        },
        setPassword: (state, value) => {
            state.password = value
        }
    }
};