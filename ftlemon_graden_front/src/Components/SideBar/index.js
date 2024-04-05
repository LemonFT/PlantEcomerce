import classNames from "classnames/bind";
import React, { useContext } from "react";
import styles from "./index.module.scss";

import { Link, useNavigate } from "react-router-dom";
import lg from "../../Images/lg.png";
import user_img from "../../Images/user_img.png";
import { DataContext } from "../../Provider/DataProvider";
import { EffectContext } from "../../Provider/EffectProvider";

function SideBar() {
    const cx = classNames.bind(styles)
    
    const navigate = useNavigate(null)

    const {sidebarOpen} = useContext(EffectContext)

    const style = sidebarOpen ? {transform: 'translateX(0)'} : {transform: 'translateX(110%)'}

    const {user, removeUser} = useContext(DataContext)

    const {focusLink, updateFocusLink} = useContext(EffectContext)

    const styleBottomLine = {borderBottomColor: 'white'}

    const updateFocus = (index) => {
        updateFocusLink(index)
    }

    return ( <>
        <div className={cx('sidebar')} style={style}>
            <div className={cx('if_user')}>
                <img src={user?.avatar || user_img} alt=""/>
                <h4>{user?.name}</h4>
            </div>
            <div className={cx('links')}>
                <Link style={focusLink === 1 ? styleBottomLine : {}} to={"/"} onClick={() => updateFocus(1)}>Home</Link>
                <Link style={focusLink === 2 ? styleBottomLine : {}} to={"/products"} onClick={() => updateFocus(2)}>Products</Link>
                <Link style={focusLink === 3 ? styleBottomLine : {}} to={"/contacts"} onClick={() => updateFocus(3)}>Contacts</Link>
            </div>
            {
                !user ? <div className={cx('in_out_btn')} onClick={() => {
                    navigate('/register')
                }}>
                    <button>Sign In</button>
                </div> : <div className={cx('in_out_btn')} onClick={() => {
                    removeUser()
                }}>
                    <button>Sign Out</button>
                </div>
            }
            <div className={cx('logo')}>
                <img src={lg} alt="" />
            </div>
        </div>
    </> );
}

export default SideBar;