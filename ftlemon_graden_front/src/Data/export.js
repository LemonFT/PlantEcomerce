import { getToken } from "../Global";

const saveExport = async (data) => {
    const token = await getToken()
    console.log(token)
    try {
        const response = await fetch(process.env.REACT_APP_BASEURL + `authenticed/api/export`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+token
            },
            body: JSON.stringify({
                "exportInvoice": {
                    id: 0,
                    supplier_id: data.supplier_id,
                    init_time: data.init_time,
                    user_id: data.user_id,
                    total_pay: data.total_pay
                },
                "exportInvoiceDetails": data.details
            })
        })
        return response.status === 200
    } catch (error) {
        console.log(error)
    }
    return false
}

export { saveExport };
