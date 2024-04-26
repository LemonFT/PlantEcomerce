import classNames from "classnames/bind";
import React, { useContext, useEffect } from "react";
import { MdArrowBackIos, MdArrowForwardIos, MdChecklistRtl, MdMessage, MdSupervisedUserCircle } from "react-icons/md";
import { PiPlantFill } from "react-icons/pi";
import { RxDashboard } from "react-icons/rx";
import { TiArrowBackOutline } from "react-icons/ti";
import { Link, useLocation, useNavigate } from "react-router-dom";
import user_img from "../../../Images/user_img.png";
import { DataContext } from "../../../Provider/DataProvider";
import { EffectContext } from "../../../Provider/EffectProvider";
import styles from "./index.module.scss";

function SideBar() {
    const cx = classNames.bind(styles)
    const styleIcon = { fontSize: '25px' }
    const navigate = useNavigate()
    const { sidebarAdOpen, updateSideBarAd, focusLinkAdmin, updateFocusLinkAdmin } = useContext(EffectContext)
    const { user } = useContext(DataContext)
    const style = sidebarAdOpen ? { transform: 'translateX(-90%)' } : { transform: 'translateX(0)' };
    const location = useLocation();
    const currentPath = location.pathname;
    

    useEffect(() => {
        switch (currentPath) {
            case "/admin":
                updateFocusLinkAdmin(0);
                break;
            case "/admin/order":
                updateFocusLinkAdmin(2);
                break;
            case "/admin/account":
                updateFocusLinkAdmin(3);
                break;
            case "/admin/chat":
                updateFocusLinkAdmin(4);
                break;
            case "/admin/product":
            case "/admin/product-add":
            case "/admin/product-import":
            case "/admin/product-export":
                updateFocusLinkAdmin(5);
                break;
            default:
                updateFocusLinkAdmin(0);
                break;
        }
    }, [currentPath, updateFocusLinkAdmin]);

    const authPermission = (permission) => {
        return user?.permissions.some((p) => p.name === permission);
    }

    return (<>
        <div className={cx('sidebar')} style={style}>
            <span onClick={() => updateSideBarAd()} className={cx('arrow')}>
                {!sidebarAdOpen ? <MdArrowBackIos style={styleIcon} /> : <MdArrowForwardIos style={styleIcon} />}
            </span>
            <div className={cx('info_admin')}>
                <div className={cx('avatar')}>
                    <img src={user?.avatar || user_img} alt="" />
                </div>
                <div className={cx('name')}>
                    <h3>{user?.name}</h3>
                </div>
                <div className={cx('email')}>
                    <span>{user?.email}</span>
                </div>
            </div>
            <div className={cx('links')}>
                {
                    authPermission("VIEW_STATISTICS") && 
                    <div className={focusLinkAdmin === 1 ? cx('link', 'focus') : cx('link')} onClick={() => {
                        navigate('/admin/dashboard')
                        updateFocusLinkAdmin(1)
                    }}>
                        <Link>DashBoard</Link>
                        <span><RxDashboard style={styleIcon} /></span>
                    </div>
                }
                {
                    authPermission("ORDER") &&
                    <div className={focusLinkAdmin === 2 ? cx('link', 'focus') : cx('link')} onClick={() => {
                        navigate('/admin/order')
                        updateFocusLinkAdmin(2)
                    }}>
                        <Link>
                            Order
                        </Link>
                        <span><MdChecklistRtl style={styleIcon} /></span>
                    </div>
                }
                {
                    authPermission("ACCOUNT_MANAGEMENT") &&
                    <div className={focusLinkAdmin === 3 ? cx('link', 'focus') : cx('link')} onClick={() => {
                        navigate('/admin/account')
                        updateFocusLinkAdmin(3)
                    }}>
                        <Link>
                            Account
                        </Link>
                        <span>
                            <MdSupervisedUserCircle style={styleIcon} />
                        </span>
                    </div>
                }
                {
                    authPermission("CUSTOMER_CONSULTING") &&
                    <div className={focusLinkAdmin === 4 ? cx('link', 'focus') : cx('link')} onClick={() => {
                        navigate('/admin/chat')
                        updateFocusLinkAdmin(4)
                    }}>
                        <Link >
                            Message
                        </Link>
                        <span><MdMessage style={styleIcon} /></span>
                    </div>
                }
                {
                    authPermission("PRODUCT") && 
                    <div className={focusLinkAdmin === 5 ? cx('link', 'focus') : cx('link')} onClick={() => {
                        navigate('/admin/product')
                        updateFocusLinkAdmin(5)
                    }}>
                        <Link>
                            Product
                        </Link>
                        <span><PiPlantFill style={styleIcon} /></span>
                    </div>
                }
            </div>
            <div className={cx('exit')}>
                <button onClick={() => { navigate("/") }}><TiArrowBackOutline style={styleIcon} /> </button>
            </div>
        </div>
    </>);
}

export default SideBar;