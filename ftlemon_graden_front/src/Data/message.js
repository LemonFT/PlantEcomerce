import { getToken } from "../Global";


const getAllMessage = async (user_id) => {
    const token = await getToken()
    try {
        const response = await fetch(process.env.REACT_APP_BASEURL+`authenticed/api/message/${user_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'Authorization': 'Bearer '+ token
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const deleteUserChat = async (userId) => {
    console.log(userId)
    const token = await getToken()
    try {
        const response = await fetch(process.env.REACT_APP_BASEURL + `authenticed/api/message/${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+token
            }
        })
        const status = (await response).status
        return status === 200
    } catch (error) {
        console.log(error)
    }
    return false
}

export { deleteUserChat, getAllMessage };
