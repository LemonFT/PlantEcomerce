import { getToken } from "../Global"

const getProducts = async (numpage, numperpage, search, min, max, category) => {
    if(search === undefined){
        search = ""
    }

    try{
        const response = await fetch(process.env.REACT_APP_BASEURL+
            `api/product/${numpage}/${numperpage}/filter?search=${search}&min=${min}&max=${max}&category_ids=${category}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const status = await response.status
        if(status === 200){
            return await response.json()
        }else{
            return null;
        }
    }catch(ex){
        return null
    }
}

const getAllProduct = async () => {
    try{
        const response = await fetch(process.env.REACT_APP_BASEURL+`api/product`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const status = await response.status
        if(status === 200){
            return await response.json()
        }else{
            return null;
        }
    }catch(ex){
        return null
    }
}

const getMaxPriceProduct =  async() => {
    try{
        const response = await fetch(process.env.REACT_APP_BASEURL+`api/product/max-price`, {
            method: "GET", 
            headers: {
                "Content-Type": "application/json"
            }
        })
        const status = await response.status
        if(status === 200){
            return await response.text();
        }else{
            return null;
        }
    }catch{
        return null;
    }
}
const addProductToCart = async (user_id, product_id, number) => {
    const token = await getToken()
    try {
        const response = await fetch(process.env.REACT_APP_BASEURL+`authenticed/api/cart`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer '+ token
            },
            body: JSON.stringify({
                user_id: user_id, 
                product_id: product_id,
                number: number
            })
        })
        const status = await response.status
        if(status === 200){
            return 1
        }else if(status === 404){
            return -1
        }else{
            return 0;
        }
    } catch (error) {
        return 0;
    }
}

const getCart = async (user_id) => {
    const token = await getToken()
    try {
        const response = await fetch(process.env.REACT_APP_BASEURL + `authenticed/api/cart/${user_id}`, {
            method: "GET", 
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer '+token
            }
        })

        const status = await response.status
        if(status === 403){
            console.log("Authorization invalid")
        }
        if(status === 200){
            return await response.json()
        }else{
            return null;
        }
    } catch (error) {
        return null;
    }
}

const getProductCategory = async () => {
    try {
        const response = await fetch(process.env.REACT_APP_BASEURL+`api/product/category`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const status = response.status
        if(status === 200){
            return response.json()
        }else{
            return null
        }
    } catch (error) {
        return null
    }
}
const deleteProductInCart = async (user_id, product_id) => {
    const token = await getToken()
    try {
        const response = await fetch(process.env.REACT_APP_BASEURL + `authenticed/api/cart/${user_id}/${product_id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+token
            }
        })
        const status = await response.status
        if(status === 200){
            return 1;
        }else if(status === 404){
            return -1;
        }
    } catch (error) {
            return -1;
    }
}

const deleteAllProductInCart = async (user_id) => {
    const token = await getToken()
    try {
        const response = await fetch(process.env.REACT_APP_BASEURL + `authenticed/api/cart/${user_id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+token
            }
        })
        const status = await response.status
        if(status === 200){
            return 1;
        }else if(status === 404){
            return -1;
        }
    } catch (error) {
            return -1;
    }
}

const getInfoDetails = async (product_id) => {
    try {
        const response = await fetch(process.env.REACT_APP_BASEURL+ `api/product/${product_id}`, {
            method: "GET", 
            headers: {
                "Content-Type": "application/json"
            }
        })
        const status = await response.status
        if(status === 200){
            return await response.json()
        }else{
            return null
        }
    } catch (error) {
        return null;
    }
}

const updateProduct = async (product) => {
    console.log(product)
    const token = await getToken()
    try {
        const response = await fetch(process.env.REACT_APP_BASEURL + `authenticed/api/product`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+token
            },
            body: JSON.stringify({
                id: product.id,
                code: "",
                name: product.name,
                image: "",
                category_product_id: product.category,
                description: product.desc,
                amount: product.amount,
                price: product.price,
                voucher: product.voucher,
                display: product.display,
            })
        })
        const status = await response.status
        return status === 200
    } catch (error) {
        return false
    }
}

const updateImageProduct = async (product_id, image) => {
    const token = await getToken()
    try {
        const response = await fetch(process.env.REACT_APP_BASEURL + `authenticed/api/product/image`,{
            method: "PUT", 
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+token
            },
            body: JSON.stringify({
                id: product_id,
                image: image
            })
        })
        const status = (await response).status
        return status === 200
    } catch (error) {
        return false
    }
}

const deleteImage = async (product_id, image) => {
    const token = await getToken()
    try {
        const response = await fetch(process.env.REACT_APP_BASEURL + `authenticed/api/image`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+token
            },
            body: JSON.stringify({
                product_id: product_id,
                image: image
            })
        })
        const status = await response.status
        console.log(status)
        return status === 200
    } catch (error) {
        console.log(error)
        return false
    }
}

const insertImage = async (product_id, url) => {
    console.log(product_id)
    console.log(url)
    const token = await getToken()
    try {
        const response = fetch(process.env.REACT_APP_BASEURL + `authenticed/api/image`, {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+token
            },
            body: JSON.stringify({
                product_id: product_id,
                image: url
            })
        })
        const status = (await response).status
        return status === 200
    } catch (error) {
        return false
    }
}

export {
    addProductToCart, deleteAllProductInCart, deleteImage, deleteProductInCart, getAllProduct, getCart, getInfoDetails,
    getMaxPriceProduct, getProductCategory, getProducts, insertImage, updateImageProduct, updateProduct
}


