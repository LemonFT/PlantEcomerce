import { getToken } from "../Global";

const getAllRole = async () => {
    const token = await getToken()
    try {
        const response = fetch(process.env.REACT_APP_BASEURL + `authenticed/api/roles`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+token
            }
        })

        const status = (await response).status
        return status === 200 ? (await response).json() : null
    } catch (error) {
        console.log(error)
    }
    return null
}

export { getAllRole };
