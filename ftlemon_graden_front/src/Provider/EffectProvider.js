import { useState } from "react";

const { createContext } = require("react");

const EffectContext = createContext();
function EffectProvider({children}) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [messOpen, setMessOpen] = useState(false)
    const [sidebarAdOpen, setSidebarAdOpen] = useState(false)
    const [focusLink, setFocusLink] = useState(1)
    const [focusLinkAdmin, setFocusLinkAdmin] = useState(1)

    const updateSideBar = () => {
        if(!sidebarOpen && messOpen){
            setMessOpen(false)
        }
        setSidebarOpen(!sidebarOpen)
    }

    const updateMess = () => {
        if(!messOpen && sidebarOpen){
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

    return ( <>
        <EffectContext.Provider
            value={{sidebarOpen, updateSideBar
                    ,messOpen, updateMess
                    ,sidebarAdOpen, updateSideBarAd
                    ,focusLink, updateFocusLink
                    ,focusLinkAdmin, updateFocusLinkAdmin}}
        >
            {children}
        </EffectContext.Provider>
    </> );
}

export { EffectContext, EffectProvider };
