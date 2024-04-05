import { createContext, useEffect, useState } from "react";
import { Cookies, useCookies } from "react-cookie";
import { getMaxPriceProduct, getProductCategory } from "../Data/product";
import { getInfoUser } from "../Data/user";
const DataContext = createContext()
function DataProvider({ children }) {
    const [cookie, setCookie] = useCookies([])
    const [user, setUser] = useState()
    const [cookieChange, setCookieChange] = useState(false)
    const [maxPrice, setMaxPrice] = useState(1000000)
    const [productCategory, setProductCategory] = useState([])
    const [urlHistory, setUrlHistory] = useState(null)

    const updateCookie = ({ key, value, expires }) => {
        setCookie(key, value, { expires: expires, path: '/', sameSite: 'Strict' })
        setTimeout(() => {
            setCookieChange(!cookieChange)
        }, 1000)
    }

    const updateMaxPriceProduct = async () => {
        const maxPrice = await getMaxPriceProduct()
        if(maxPrice != null){
            setMaxPrice(maxPrice)
        }
    }

    const updateProductCategorys = async () => {
        const product_category = await getProductCategory()
        if(product_category != null){
            setProductCategory(product_category)
        }
    }

    useEffect(() => {
        updateMaxPriceProduct()
        updateProductCategorys()
    }, [])

    useEffect(() => {
        const cookies = new Cookies();
        if(!cookies.get("tokens")) return;
        const updateUserInfo = async () => {
            try {
                const data = await getInfoUser();
                setUser(data);
            } catch (error) {
                console.log(error);
            }
        };
        updateUserInfo()
    }, [cookieChange])


    const removeUser = () => {
        updateCookie({key: 'tokens', value: null, expires: new Date()})
        setUser(null)
    }

    const updateUrlHistory = (url) => {
        setUrlHistory(url)
    }


    return (<>
        <DataContext.Provider
            value={
                {
                    user, removeUser,
                    cookie, updateCookie,
                    maxPrice, productCategory,
                    urlHistory, updateUrlHistory
                }
            }
        >
            {children}
        </DataContext.Provider>
    </>);
}

export { DataContext, DataProvider };
