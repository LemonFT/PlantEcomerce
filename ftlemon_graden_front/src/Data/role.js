import { getToken } from '../Global';

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

const saveRole = async (data) => {
    const token = await getToken()
    try {
        const response = await fetch(process.env.REACT_APP_BASEURL + `authenticed/api/role`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+token
            },
            body: JSON.stringify(data)
        })
        return (await response).status === 200
    } catch (error) {
        console.log(error)
    }
    return false
}

const updateNameRole = async (data) => {
    const token = await getToken()
    try {
        const response = await fetch(process.env.REACT_APP_BASEURL + `authenticed/api/role`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+token
            },
            body: JSON.stringify(data)
        })
        return (await response).status === 200
    } catch (error) {
        console.log(error)
    }
    return false
}
export { getAllRole, saveRole, updateNameRole };
