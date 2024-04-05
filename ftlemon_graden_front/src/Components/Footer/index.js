import classNames from "classnames/bind";
import React from "react";
import styles from "./index.module.scss";

import potted_plant_img from '../../Images/logoFt.png';

import { BsPhone } from "react-icons/bs";
import { PiMessengerLogoFill } from "react-icons/pi";
import { SiZalo } from "react-icons/si";

import { Link } from "react-router-dom";


function Footer() {
    const cx = classNames.bind(styles)
    const styleIcon = {fontSize: '25px'}
    return ( <>
        <div className={cx('footer')}>
            <div className={cx('cl_1')}>
                <div className={cx('potted_plant')}>
                    <img src={potted_plant_img} alt="" />
                    <span>FTGARDEN</span>
                </div>
                <div className={cx('text')}>
                    <p>Note that the development build is not optimized.To create a production build</p>
                </div>
                <div className={cx('groups_icon_contact')}>
                    <span><SiZalo style={styleIcon}/></span>
                    <span><PiMessengerLogoFill style={styleIcon}/></span>
                    <span><BsPhone style={styleIcon}/></span>
                </div>
            </div>
            <div className={cx('cl_2')}>
                <div className={cx('title')}>
                    <h3>Quick Link's</h3>
                </div>
                <div className={cx('links')}>
                    <Link to={"/"}><span>Home</span></Link>
                    <Link to={"/"}><span>Products</span></Link>
                    <Link to={"/"}><span>Contacts</span></Link>
                    <Link to={"/"}><span>Privacy</span></Link>
                </div>
            </div>
            <div className={cx('cl_3')}>
                <div className={cx('title')}>
                    <h3>For Every Update's</h3>
                </div>
                <div className={cx('email_subscribe')}>
                    <div className={cx('box_ip')}>
                    <input placeholder="Enter email" />
                    <button>subscribe</button>
                    </div>
                </div>
            </div>
        </div>
    </> );
}

export default Footer;