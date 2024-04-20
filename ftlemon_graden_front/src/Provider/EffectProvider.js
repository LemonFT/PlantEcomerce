import { createContext, useEffect, useState } from "react";


const EffectContext = createContext();
function EffectProvider({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [messOpen, setMessOpen] = useState(false)
    const [sidebarAdOpen, setSidebarAdOpen] = useState(false)
    const [focusLink, setFocusLink] = useState(
        Number(localStorage.getItem("focusLink")) || 1
    );
    const [focusLinkAdmin, setFocusLinkAdmin] = useState(
        Number(localStorage.getItem("focusLinkAdmin")) || 1
    );
    const [focusLinkProduct, setFocusLinkProduct] = useState(
        Number(localStorage.getItem("focusLinkProduct")) || 1
    );

    const updateSideBar = () => {
        if (!sidebarOpen && messOpen) {
            setMessOpen(false)
        }
        setSidebarOpen(!sidebarOpen)
    }

    const updateMess = () => {
        if (!messOpen && sidebarOpen) {
            setSidebarOpen(false)
        }
        setMessOpen(!messOpen)
    }

    const updateSideBarAd = () => {
        setSidebarAdOpen(!sidebarAdOpen)
    }

    const updateFocusLink = (index) => {
        setFocusLink(index)
    }

    const updateFocusLinkAdmin = (index) => {
        setFocusLinkAdmin(index)
    }

    const updateFocusLinkProduct = (index) => {
        setFocusLinkProduct(index)
    }

    useEffect(() => {
        localStorage.setItem("focusLink", focusLink);
        localStorage.setItem("focusLinkAdmin", focusLinkAdmin);
        localStorage.setItem("focusLinkProduct", focusLinkProduct);
    }, [focusLink, focusLinkAdmin, focusLinkProduct])

    return (<>
        <EffectContext.Provider
            value={{
                sidebarOpen, updateSideBar
                , messOpen, updateMess
                , sidebarAdOpen, updateSideBarAd
                , focusLink, updateFocusLink
                , focusLinkAdmin, updateFocusLinkAdmin
                , focusLinkProduct, updateFocusLinkProduct
            }}
        >
            {children}
        </EffectContext.Provider>
    </>);
}

export { EffectContext, EffectProvider };
