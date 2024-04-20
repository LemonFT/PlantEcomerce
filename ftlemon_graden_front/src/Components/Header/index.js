import classNames from "classnames/bind";
import React, { useContext, useEffect, useState } from "react";
import { CiMenuFries, CiShoppingCart } from "react-icons/ci";
import { IoChatboxOutline } from "react-icons/io5";
import { RiAdminLine } from "react-icons/ri";
import { TbMinusVertical } from "react-icons/tb";
import { Link, useLocation } from "react-router-dom";
import lg from "../../Images/lg.png";
import { DataContext } from "../../Provider/DataProvider";
import { EffectContext } from "../../Provider/EffectProvider";
import styles from "./index.module.scss";

function Header() {
    const cx = classNames.bind(styles)
    const styleIcon = { fontSize: '25px' }
    const { focusLink, updateFocusLink ,updateSideBar, updateMess } = useContext(EffectContext)
    const { user } = useContext(DataContext)
    const location = useLocation();
    const [currentPath, setCurrentPath] = useState("");

    const style = { transform: 'translateX(0)' }
    const updateFocus = (index) => {
        updateFocusLink(index)
    }

    useEffect(() => {
        setCurrentPath(location.pathname);
    }, [location.pathname]);

    useEffect(() => {
        switch (currentPath) {
            case "/":
                updateFocusLink(1);
                break;
            case "/products":
            case "/productdetails":
                updateFocusLink(2);
                break;
            case "/contacts":
                updateFocusLink(3);
                break;
            // Thêm các case khác tương ứng với các trang của bạn
            default:
                updateFocusLink(null);
                break;
        }
    }, [currentPath, updateFocusLink]);
    
    return (
        <div className={cx('header')}>
            <div className={cx('header-left')}>
                <div className={cx('lg')} >
                    <img src={lg} alt="" />
                </div>
                <div className={cx('menu')}>
                    <div className={cx('item-menu')}>
                        <Link to={"/"} onClick={() => updateFocus(1)}>Home</Link>
                        <span style={focusLink === 1 ? style : {}} className={cx('line-bottom')}></span>
                    </div>
                    <div className={cx('item-menu')}>
                        <Link to={"/products"} onClick={() => updateFocus(2)}>Products</Link>
                        <span style={focusLink === 2 ? style : {}} className={cx('line-bottom')}></span>
                    </div>
                    <div className={cx('item-menu')}>
                        <Link to={"/contacts"} onClick={() => updateFocus(3)}>Contact</Link>
                        <span style={focusLink === 3 ? style : {}} className={cx('line-bottom')}></span>
                    </div>
                </div>
            </div>
            <div className={cx('header-right')}>
                {(user?.role)?.toString() === process.env.REACT_APP_ADMIN_ROLE &&
                    <Link to={"/admin"}>
                        <RiAdminLine style={styleIcon} />
                    </Link>
                }
                <Link to={"/cart"} onClick={() => {
                    updateFocus(4)
                }}><span><CiShoppingCart style={styleIcon} /></span></Link>
                {
                    (user && !(user?.role)?.toString() === process.env.REACT_APP_ADMIN_ROLE) && <Link><span onClick={() => { updateMess() }}><IoChatboxOutline style={styleIcon} /></span></Link>
                }
                <span className={cx('line-vertical')}><TbMinusVertical style={styleIcon} /></span>
                <Link><span onClick={() => { updateSideBar() }}><CiMenuFries style={styleIcon} /></span></Link>
            </div>
        </div>
    );
}

export default Header;