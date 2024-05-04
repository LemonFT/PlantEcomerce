import { getToken } from "../Global";

const getStatistics = async(year) => {
    const token = await getToken()
    try {
        const response = await fetch(process.env.REACT_APP_BASEURL + `authenticed/api/statistics/${year}`, {
            method: "GET", 
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': 'Bearer '+token
            }
        })
        return response.json()
    } catch (error) {
        console.error(error)
    }
    return null
}

export { getStatistics };
