import classNames from 'classnames/bind';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';

const PriceFilter = ({min, max, funcGetRange}) => {
    const cx = classNames.bind(styles)

    const [range, setRange] = useState([0,1000000])

    const handleRangeUpdate = (newRange) => {
        setRange(newRange)
        funcGetRange(newRange)
    }

    useEffect(() => {
        setRange([min, max])
    }, [min, max])
    return (
        <>
            <div className={cx('box-slider')}>
                <span className={cx('title')}>Giá: </span>
                <div className={cx('from-price')}>{range[0]}</div>
                <Slider range={true} className={cx('slider')} onChange={(newRange) => handleRangeUpdate(newRange)} value={range} min={min} max={max} />
                <div className={cx('to-price')}>{range[1]}</div>
            </div>
        </>
    );
};

export default PriceFilter;
