export default {
    namespaced: true,
    state: {
        boardList: [],
        selectedBoards: [],
    },
    getters: {
        getBoardList: state => {
            return state.boardList;
        },
        getSelectedBoards: state => {
            return state.selectedBoards
        }
    },
    actions: {
        setBoardList: ({commit}, payload) => {
            commit('setBoardList', payload);
        },
        setSelectedBoards: ({commit}, payload) => {
            commit('setSelectedBoards', payload);
        }
    },
    mutations: {
        setBoardList: (state, value) => {
            state.boardList = value;
        },
        setSelectedBoards: (state, value) => {
            state.selectedBoards = value;
        }
    }
};