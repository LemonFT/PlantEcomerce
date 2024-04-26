import classNames from 'classnames/bind';
import React from 'react';
import styles from './index.module.scss';

const cx = classNames.bind(styles);

const WelcomePage = () => {
    return (
        <div className={cx('container')}>
            <h1 className={cx('title')}>Welcome to Admin Page</h1>
            <p className={cx('message')}>Enjoy your stay!</p>
        </div>
    );
};

export default WelcomePage;
