import { getToken } from "../Global";

const saveImport = async (data) => {
    const token = await getToken();
    try {
        const response = fetch(process.env.REACT_APP_BASEURL + `authenticed/api/import`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Authorization": "Bearer "+token
            },
            body: JSON.stringify({
                "importInvoice": {
                    id: 0,
                    supplier_id: data.supplier_id,
                    init_time: data.init_time,
                    user_id: data.user_id,
                    total_pay: data.total_pay
                },
                "importInvoiceDetails": data.details
            })
        })
        return (await response).status === 200
    } catch (error) {
        console.log(error)
    }
    return false
}

const getCostImport = async (year) => {
    const token = await getToken()
    try {
        const response = await fetch(process.env.REACT_APP_BASEURL + `authenticed/api/import-cost/${year}`, {
            method: 'GET', 
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

export { getCostImport, saveImport };

