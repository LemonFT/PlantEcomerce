import classNames from "classnames/bind";
import React, { useContext, useEffect } from "react";
import { MdArrowBackIos, MdArrowForwardIos, MdChecklistRtl, MdMessage, MdSupervisedUserCircle } from "react-icons/md";
import { PiPlantFill } from "react-icons/pi";
import { RxDashboard } from "react-icons/rx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { EffectContext } from "../../../Provider/EffectProvider";
import styles from "./index.module.scss";

function SideBar() {
    const cx = classNames.bind(styles)
    const styleIcon = {fontSize: '25px'}
    const navigate = useNavigate()
    const {sidebarAdOpen, updateSideBarAd} = useContext(EffectContext)
    const style = sidebarAdOpen ? {transform: 'translateX(-90%)'} : {transform: 'translateX(0)'};
    const {focusLinkAdmin,updateFocusLinkAdmin} = useContext(EffectContext)
    const location = useLocation();
    const currentPath = location.pathname;

    useEffect(() => {
        switch (currentPath) {
            case "/admin":
                updateFocusLinkAdmin(1);
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
                updateFocusLinkAdmin(1);
                break;
        }
    }, [currentPath, updateFocusLinkAdmin]);
    

    return (<>
        <div className={cx('sidebar')} style={style}>
            <span onClick={() => updateSideBarAd()} className={cx('arrow')}>
                {!sidebarAdOpen ? <MdArrowBackIos style={styleIcon}/> : <MdArrowForwardIos style={styleIcon} /> }
            </span>
            <div className={cx('info_admin')}>
                <div className={cx('avatar')}>
                    <img src="https://firebasestorage.googleapis.com/v0/b/authfacebyfirebase.appspot.com/o/1.jpg?alt=media&token=9324fe68-d892-4da8-a89e-d9bbe1329a09" alt="" />
                </div>
                <div className={cx('name')}>
                    <h3>Nguyễn Hoàng Diệu Thảo</h3>
                </div>
                <div className={cx('email')}>
                    <span>thaothao@gmail.vn</span>
                </div>
            </div>
            <div className={cx('links')}>
                <div className={focusLinkAdmin === 1 ? cx('link', 'focus') : cx('link')} onClick={() => {
                    navigate('/admin')
                    updateFocusLinkAdmin(1)
                }}>
                    <Link>DashBoard</Link>
                    <span><RxDashboard style={styleIcon}/></span>
                </div>
                <div className={focusLinkAdmin === 2 ? cx('link', 'focus') : cx('link')} onClick={() => {
                    navigate('/admin')
                    updateFocusLinkAdmin(2)
                }}>
                    <Link>
                        Order
                    </Link>
                    <span><MdChecklistRtl style={styleIcon}/></span>
                </div>
                <div className={focusLinkAdmin === 3 ? cx('link', 'focus') : cx('link')} onClick={() => {
                    navigate('/admin')
                    updateFocusLinkAdmin(3)
                }}>
                    <Link>
                        Account
                    </Link>
                    <span>
                        <MdSupervisedUserCircle style={styleIcon}/>
                    </span>
                </div>
                <div className={focusLinkAdmin === 4 ? cx('link', 'focus') : cx('link')} onClick={() => {
                    navigate('/admin/chat')
                    updateFocusLinkAdmin(4)
                }}>
                    <Link >
                        Message
                    </Link>
                    <span><MdMessage style={styleIcon}/></span>
                </div>
                <div className={focusLinkAdmin === 5 ? cx('link', 'focus') : cx('link')} onClick={() => {
                    navigate('/admin/product')
                    updateFocusLinkAdmin(5)
                }}>
                    <Link>
                        Product
                    </Link>
                    <span><PiPlantFill style={styleIcon}/></span>
                </div>
            </div>
        </div>
    </>);
}

export default SideBar;