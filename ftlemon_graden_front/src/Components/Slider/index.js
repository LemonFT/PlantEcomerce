import classNames from 'classnames/bind';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';

const PriceFilter = ({ min, max, funcGetRange }) => {
    const cx = classNames.bind(styles)

    const [range, setRange] = useState([0, 1000000])

    const handleRangeUpdate = (newRange) => {
        const integerRange = newRange.map(Number); 
        setRange(integerRange);
        funcGetRange(integerRange);
        console.log(integerRange);
    }

    useEffect(() => {
        setRange([min, max].map(Number)); 
    }, [min, max]);

    return (
        <>
            <div className={cx('box-slider')}>
                <div className={cx('from-price')}>{range[0]} VND</div>
                <Slider
                    range={true}
                    className={cx('slider')}
                    onChange={(newRange) => handleRangeUpdate(newRange)}
                    value={range}
                    min={min}
                    max={max}
                />
                <div className={cx('to-price')}>{range[1]} VND</div>
            </div>
        </>
    );
};

export default PriceFilter;
