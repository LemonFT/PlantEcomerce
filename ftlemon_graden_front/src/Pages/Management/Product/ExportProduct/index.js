import classNames from "classnames/bind";
import React from "react";
import HeaderProduct from "../HeaderProduct";
import styles from "../index.module.scss";

function ExportProduct() {
    const cx = classNames.bind(styles)
    return ( <>
        <div className={cx('product')}>
            <HeaderProduct />
            <div className={cx('export_product')}>
                
            </div>
        </div>
    </> );
}

export default ExportProduct;