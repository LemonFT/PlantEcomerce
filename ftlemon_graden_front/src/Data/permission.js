import { getToken } from "../Global";

const getAllPermisson = async () => {
    const token = await getToken()
    try {
        const response = await fetch(process.env.REACT_APP_BASEURL + `authenticed/api/permissions`, {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+token
            }
        })
        const status = (await response).status
        return status === 200 ? (await response).json() : null
    } catch (error) {
        console.error(error)
    }
    return null
}

const getAllPermissonByRoleId = async (roleId) => {
    const token = await getToken()
    try {
        const response = await fetch(process.env.REACT_APP_BASEURL + `authenticed/api/role-permission/${roleId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+token
            }
        })
        const status = (await response).status
        return status === 200 ? (await response).json() : null
    } catch (error) {
        console.error(error)
    }
    return null
}

const updatePermissionsByRole = async (data) => {
    const token = await getToken()
    try {
        const response = await fetch(process.env.REACT_APP_BASEURL + 'authenticed/api/role-permission', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': 'Bearer '+token
            },
            body: JSON.stringify(data)
        })
        return (await response).status === 200
    } catch (error) {
        console.error(error)
    }
    return false
} 

export { getAllPermisson, getAllPermissonByRoleId, updatePermissionsByRole };
