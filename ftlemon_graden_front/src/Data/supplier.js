import { getToken } from "../Global";

const getAllSupplier = async () => {
    const token = await getToken();
    try {
        const response = await fetch(process.env.REACT_APP_BASEURL+`authenticed/api/supplier`, {
            method: "GET", 
            headers: {
                "Content-type": "application/json",
                "Authorization": "Bearer "+token
            }
        })
        const status = response.status;
        return status === 200 ? response.json() : null
    } catch (error) {
        console.log(error)
        return null;
    }
}

const deleteSupplierById = async(id) => {
    const token = await getToken();
    try {
        const response = fetch(process.env.REACT_APP_BASEURL + `authenticed/api/supplier/${id}`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
                "Authorization": "Bearer "+token
            }
        })
        const status = (await response).status
        return status === 200
    } catch (error) {
        console.log(error)
        return false;
    }
}

const saveSupplier = async (supplier) => {
    const token = await getToken();
    try {
        const response = await fetch(process.env.REACT_APP_BASEURL + `authenticed/api/supplier`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+token
            },
            body: JSON.stringify(supplier)
        })
        console.log((await response).json)
        return (await response).text()
    } catch (error) {
        console.log(error)
    }
    return -1;
}

export { deleteSupplierById, getAllSupplier, saveSupplier };

