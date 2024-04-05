import classNames from "classnames/bind";
import React, { useContext } from "react";
import { EffectContext } from "../../Provider/EffectProvider";
import SideBar from "./SideBar";
import styles from "./index.module.scss";
function Management({children}) {
    const cx = classNames.bind(styles)
    const {sidebarAdOpen} = useContext(EffectContext)
    const styleClass_admin = sidebarAdOpen ? {paddingLeft: '0px'} : {paddingLeft: '20vw'}
    const styleClass_container = sidebarAdOpen ? {width: '95vw'} : {width: '75vw'}
    return ( <>
        <SideBar />
        <div className={cx('admin')} style={styleClass_admin}>
            <div className={cx('container')}  style={styleClass_container}>
                {children}
            </div>
        </div>
    </> );
}

export default Management;