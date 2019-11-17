export default {
    namespaced: true,
    state: {
        sprintList: [],  // not used
        payload: {}
    },
    getters: {
        getSprintList: state => {
            return state.sprintList;
        },
        getPayload: state => {
            return state.payload;
        }
    },
    actions: {
        setSprintList: ({commit}, payload) => {
            commit('setSprintList', payload);
        },
        setPayload: ({commit}, payload) => {
            commit('setPayload', payload);
        }
    },
    mutations: {
        setSprintList: (state, value) => {
            state.sprintList = value;
        },
        setPayload: (state, value) => {
            state.payload = value;
        }
    }
};