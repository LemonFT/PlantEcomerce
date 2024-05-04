import { getToken } from "../Global";

const getAllOrdersByUserId = async (userId) => {
    const token = await getToken()
    try {
        const response = await fetch(process.env.REACT_APP_BASEURL + `authenticed/api/orders/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+token
            }
        })
        return response.status === 200 ? response.json() : null
    } catch (error) {
        console.error(error)
    }
    return null
}

const getAllOrders = async () => {
    const token = await getToken()
    try {
        const response = await fetch(process.env.REACT_APP_BASEURL + `authenticed/api/orders`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+token
            }
        })
        return response.status === 200 ? response.json() : null
    } catch (error) {
        console.error(error)
    }
    return null
}

const saveOrder = async (data) => {
    const token = await getToken()
    try {
        const response = await fetch(process.env.REACT_APP_BASEURL + `authenticed/api/order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+token
            },
            body: JSON.stringify(data)
        })
        return (response).text()
    } catch (error) {
        console.error(error)
    }
    return 0;
}

const deleteOrder = async (orderId) => {
    const token = await getToken()
    try {
        const response = await fetch(process.env.REACT_APP_BASEURL + `authenticed/api/order/${orderId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application',
                'Authorization': 'Bearer '+token
            },
        })
        return (response).status === 200
    } catch (error) {
        console.error(error)
    }
    return false
}

const paymentOrder = async (amount) => {
    const token = await getToken()
    try {
        const response = await fetch(process.env.REACT_APP_BASEURL + `payment/${amount}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': 'Bearer '+token
            }
        })
        const url = (response).text()
        return url
    } catch (error) {
        console.error(error)
    }
    return ""
}

const updateExchangeProgressing = async (data) => {
    const token = await getToken()
    try {
        const response = await fetch(process.env.REACT_APP_BASEURL + `authenticed/api/exchange`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': 'Bearer '+token
            },
            body: JSON.stringify(data)
        })
        return response.status === 200
    } catch (error) {
        console.error(error)
    }
    return false
}

const updateStatusOrder = async (orderId, statusOrder) => {
    const token = await getToken()
    try {
        const response = await fetch(process.env.REACT_APP_BASEURL + `authenticed/api/progressingorder/${orderId}/${statusOrder}`, {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': 'Bearer '+token
            }
        })

        return response.status === 200
    } catch (error) {
        console.error(error)
    }
    return false
}   

const updateStatusOrders = async (orderIds, statusOrder) => {
    const token = await getToken()
    try {
        const response = await fetch(process.env.REACT_APP_BASEURL + `authenticed/api/progressingorder`, {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+token
            },
            body: JSON.stringify({
                orders: orderIds,
                status: statusOrder
            })
        })
        return response.status === 200
    } catch (error) {
        console.error(error)
    }
    return false
}
const getRevenueFromSuccess = async (year) => {
    const token = await getToken()
    try {
        const response = await fetch(process.env.REACT_APP_BASEURL + `authenticed/api/success-revenue/${year}`, {
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
export {
    deleteOrder, getAllOrders, getAllOrdersByUserId, getRevenueFromSuccess, paymentOrder, saveOrder, updateExchangeProgressing,
    updateStatusOrder, updateStatusOrders
};

