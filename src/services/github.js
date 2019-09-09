import axios from 'axios'

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
    performFlightCheck() {
        return axiosClient.get('/ganalyzer/flightcheck/')
    }
}