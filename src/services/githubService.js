import axios from 'axios'

axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.xsrfCookieName = 'csrftoken'

const axiosClient = axios.create(
    {
        baseURL: process.env.VUE_APP_BASE_API,
        withCredentials: false,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    }
)

export default {
    performFlightCheck(token, username) {
        return axiosClient.post('/ganalyzer/flightcheck/',
            {token: token, username: username})
    },
    getRepositoriesFromGitHub(username, token) {
        return axiosClient.post('/ganalyzer/listrepository/',
            {token: token, username: username})
    },
    createRepositoryFromFile(data) {
        return axiosClient.post(
            '/ganalyzer/createrepository/',
            data
        )
    }
}