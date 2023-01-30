import axios from "axios";

const apiBase = axios.create({
    baseURL: 'https://plum-confused-lovebird.cyclic.app'
})

export default apiBase