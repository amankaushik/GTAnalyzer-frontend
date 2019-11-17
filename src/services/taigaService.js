import axios from 'axios'

axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.xsrfCookieName = 'csrftoken'

const axiosClient = axios.create(
    {
        baseURL: process.env.VUE_APP_BASE_API,
        withCredentials: false,
        headers: {
            Accept: '*/*',
            'Content-Type': 'application/json'
        }
    }
)

export default {
    getAuthToken(username, password) {
        return axiosClient.post('/tanalyzer/getauthtoken/',
            {password: password, username: username})
    },
    getBoardList(userId, authToken) {
        return axiosClient.post('/tanalyzer/getboardlist/',
            {auth_token: authToken, user_id: userId})
    },
    createBoardFromFile(data) {
        return axiosClient.post(
            '/tanalyzer/createboard/',
            data
        )
    },
    getMilestones(authToken, boardName) {
        return axiosClient.post('/tanalyzer/milestones/',
            {auth_token: authToken, name: boardName})
    }
}