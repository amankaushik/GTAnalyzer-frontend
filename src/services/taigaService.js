import axios from 'axios'

axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.xsrfCookieName = 'csrftoken'

const axiosClient = axios.create(
    {
        // baseURL: "https://gtanalyzer.herokuapp.com/api/v1",
        baseURL: "http://127.0.0.1:8000/api/v1",
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
    }
}