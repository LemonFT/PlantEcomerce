import { getToken } from "../Global";


export const getAllMessage = async (user_id) => {
    const token = await getToken()
    if(token === ""){
        return
    }
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