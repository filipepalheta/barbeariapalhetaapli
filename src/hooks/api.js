import apiBase from "../scenes/components/apiBase.js"
import API_URL from "../scenes/components/apiURL.js"

const useApi = () => {
    return {
        getServices: async () => {
            try {
                const response = await fetch(`${API_URL}/services`);
                const json = await response.json();
                return json.services

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        },
        getBarbers: async () => {
            const res = await apiBase.get('/barbers')

            return res.data
        }
    }

}

export default useApi