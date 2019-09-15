import axios from 'axios'

axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.xsrfCookieName = 'csrftoken'

const axiosClient = axios.create(
    {
        // baseURL: "https://gtanalyzer.herokuapp.com/api/v1",
        baseURL: "http://127.0.0.1:8000/api/v1",
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
    getRepositoriesFromGitHub(token, username) {
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