import { getToken } from "../Global";

const register = async (user) => {
    try {
        const response = await fetch(process.env.REACT_APP_BASEURL+`api/user/register`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                email: user.email,
                username: user.username,
                password: user.pwd.toString()
            })
        });
        const data = await response.text()
        return data
    } catch (error) {
        console.error('Error fetching data:', error)
        throw error;
    }
};
const signIn = async (user) => {
    try {
        const response = await fetch(process.env.REACT_APP_BASEURL+'api/user/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: user.username,
                password: user.pwd
            })
        })
            const status = await response.status;
            if(status === 200){
                const data = await response.json()
                return data
            }else{
                return null
            }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

const getInfoUser = async () => {
    const token = await getToken()
    try {
        const response = await fetch(process.env.REACT_APP_BASEURL+'authenticed/api/user/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            },
            body: JSON.stringify({
                token: await getToken()
            })
        })
            const status = await response.status;
            if(status === 200){
                const data = await response.json()
                return data
            }else{
                return null
            }
    } catch (error) {
        return null
    }
}

const getContact = async (user_id) => {
    const token = await getToken()
    try {
        const response = await fetch(process.env.REACT_APP_BASEURL+`authenticed/api/user/contact/${Number(user_id)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+ token
            }
        })
        const status = await response.status
        if(status === 200){
            return response.json()
        }else{
            return null
        }
    } catch (error) {
        return null
    }
}

const saveContact = async (user_id, address_category, address, phone_number) => {
    const token = await getToken()
    try {
        const response = await fetch(process.env.REACT_APP_BASEURL + `authenticed/api/user/contact`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: user_id,
                address_category: address_category,
                address: address,
                phone_number: phone_number
            })
        })
        const status = await response.status
        if(status === 200){
            return await response.text()
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

const updateContact = async (user_id, address_category, address, phone_number) => {
    const token = await getToken()
    try {
        const response = await fetch(process.env.REACT_APP_BASEURL + `authenticed/api/user/contact`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: user_id,
                address_category: address_category,
                address: address,
                phone_number: phone_number
            })
        })
        const status = await response.status
        if(status === 200){
            return await response.text()
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}
export { getContact, getInfoUser, register, saveContact, signIn, updateContact };

