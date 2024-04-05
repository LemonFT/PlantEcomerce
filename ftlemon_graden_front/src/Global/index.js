import { jwtDecode } from "jwt-decode";
import { Cookies } from "react-cookie";

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

function formatDateHHmmSS(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

async function RefreshToken(refreshToken) {
    try {
        const response = await fetch(process.env.REACT_APP_BASEURL + `authenticed/api/user/refresh-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+refreshToken
            },
            body: JSON.stringify({
                jwtTokenOld: refreshToken
            })
        })
        const status = await response.status
        if (status === 200) {
            const tokens = await response.json()
            const expirationDate = new Date();
            const newExpirationDate = new Date(expirationDate.getTime());
            newExpirationDate.setMinutes(newExpirationDate.getMinutes() + 30);
            document.cookie = `tokens=${btoa(JSON.stringify(tokens))}; expires=${newExpirationDate}; path=/`;
            console.log("refresh token success")
        } else {
            console.log("refresh token failse")
        }
    } catch (error) {
        console.log(error)
    }
}

async function getToken() {
    const currentTimePlus = Date.now() + 10000;
    const cookies = new Cookies();
    const tokens = cookies.get("tokens");
    if (tokens) {
        const tokenObject = JSON.parse(atob(tokens))
        const timeToken = jwtDecode(tokenObject.token).exp
        const timeTokenRefresh = jwtDecode(tokenObject.refreshToken).exp

        console.log('access expires ' + Number(timeToken*1000 - currentTimePlus) )
        if (timeToken*1000 > currentTimePlus) {
            return tokenObject.token
        }
        if (timeTokenRefresh*1000 > currentTimePlus) {
            RefreshToken(tokenObject.refreshToken)
            return tokenObject.refreshToken
        }
        document.cookie = `tokens=; expires=${new Date(0).toUTCString}; path=/`;
    }else{
        window.location.href = '/register'
    }
}
export { formatDate, formatDateHHmmSS, getToken };
