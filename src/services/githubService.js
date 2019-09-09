import axios from 'axios'

axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.xsrfCookieName = 'csrftoken'

const axiosClient = axios.create(
    {
        baseURL: "https://gtanalyzer.herokuapp.com/api/v1",
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
            {token:token, username:username})
    }
}