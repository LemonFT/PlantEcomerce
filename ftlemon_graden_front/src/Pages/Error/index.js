// ErrorPage.jsx
import classNames from "classnames/bind";
import React from "react";
import styles from "./error.module.scss";

const ErrorPage = () => {
    const cx = classNames.bind(styles)
    return (
        <div className={cx('error-container')}>
            <h1 className={cx('error-title')}>Error 404</h1>
            <p className={cx('error-message')}>Page not found</p>
        </div>
    );
};

export default ErrorPage;
