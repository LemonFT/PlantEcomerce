import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import styles from "./index.module.scss";

const animatedComponents = makeAnimated();
function Combobox({options, placeholder, isMulti, closeMenuOnSelect, returnValue, width}) {
    const cx = classNames.bind(styles)
    const [value, setValue] = useState([])

    useEffect(() => {
        returnValue(value)
    }, [returnValue, value])

    
    return ( <>
        <div className={cx('box-select')} style={width ? { width: `${width}px`, height: '38px' } : {width: '300px', height: '38px'}}>
            <Select
                    className={cx('select')}
                    options={options}
                    closeMenuOnSelect={closeMenuOnSelect}
                    components={animatedComponents}
                    isMulti={isMulti}
                    placeholder={placeholder}
                    onChange={(selects) => {
                        if (isMulti) {
                            setValue(selects.map(option => option.value));
                        } else {
                            setValue(selects ? selects.value : ''); 
                        }
                    }}
            />
        </div>
    </> );
}

export default Combobox;
