import Tippy from '@tippyjs/react';
import classNames from "classnames/bind";
import React, { useContext, useRef, useState } from "react";
import { MdAutoAwesome } from "react-icons/md";
import 'tippy.js/dist/tippy.css';
import { errorAlert, processAlert, successAlert, warningAlert } from '../../../../Components/Alert';
import Combobox from "../../../../Components/Selected";
import { insertProduct } from '../../../../Data/product';
import { handleDeleteImageFb, handleImageUploadFb } from "../../../../FirebaseConfig";
import { DataContext } from "../../../../Provider/DataProvider";
import HeaderProduct from "../HeaderProduct";
import styles from "../index.module.scss";

function AddProduct() {
    const cx = classNames.bind(styles)
    const styleIcon = { fontSize: '25px' }
    const vouchers = [
        { "label": "0%", "value": 0 },
        { "label": "10%", "value": 0.1 },
        { "label": "20%", "value": 0.2 },
        { "label": "30%", "value": 0.3 },
        { "label": "40%", "value": 0.4 },
        { "label": "50%", "value": 0.5 },
        { "label": "60%", "value": 0.6 },
        { "label": "70%", "value": 0.7 },
        { "label": "80%", "value": 0.8 },
        { "label": "90%", "value": 0.9 },
        { "label": "100%", "value": 1 },
    ]
    const { productCategory } = useContext(DataContext)
    const [ imageUpload, setImageUpload ] = useState(null)
    const [category, setCategory] = useState(null)
    const [voucher, setVoucher] = useState(null)
    const refCode = useRef(null)
    const refName = useRef(null)
    const refPrice = useRef(null)
    const refDisplay = useRef(null)
    const refDesc = useRef(null)
    const convertOptionProductCategory = () => {
        return productCategory.map(item => ({
            value: item.id,
            label: item.name
        }));
    }

    const updateCategory = (categoryId) => {
        setCategory(categoryId)
    }

    const updateVoucher = (voucher) => {
        setVoucher(voucher)
    }

    const handleUploadImage = async (e) => {
        if (imageUpload) {
            handleDeleteImageFb(imageUpload)
        }
        const resultUpload = await handleImageUploadFb(e)
        if (resultUpload !== 'error') {
            setImageUpload(resultUpload)
        }
    }
    
    const refreshForm = () => {
        refCode.current.value = ""
        refName.current.value = ""
        refPrice.current.value = ""
        refDisplay.current.checked = false;
        refDesc.current.value = ""
        setImageUpload(null)
        setCategory(null)
        setVoucher(null)
    }

    const handlePrice = () => {
        if(isNaN(Number(refPrice.current.value))){
            refPrice.current.value = ""
        }
    }

    const handleSaveProduct = async () => {
        const codeStr = refCode.current.value;
        const nameStr = refName.current.value;
        const priceStr = refPrice.current.value;
        const displayStr = refDisplay.current.checked;
        const descStr = refDesc.current.value;
        if(codeStr === null || codeStr === "" || nameStr === null || nameStr === "" 
                            || priceStr === null || priceStr === "" 
                            || imageUpload === null || imageUpload === ""
                            || voucher.length === 0 || category.length === 0 ){
            warningAlert("Please, check data and try again!")
            return;
        }
        processAlert("The insert is in progress", "Completed in");
        const result = await insertProduct({
            id: 0,
            code: codeStr,
            name: nameStr, 
            image: imageUpload || "",
            category_product_id : category,
            description: descStr,
            amount: 0,
            price: priceStr,
            voucher: voucher,
            display: displayStr,
            delete: false 
        })
        if(result){
            refreshForm()
            successAlert("Insert successful");
        }else{
            errorAlert("Insert failed, check data and try again!")
        }
    }

    return (<>
        <div className={cx('product')}>
            <HeaderProduct />
            <div className={cx('add_product')}>
                <div className={cx('row_1')}>
                    <div className={cx('edt_add', 'edt_code')}>
                        <input ref={refCode} placeholder="" id="edt_code" />
                        <label htmlFor="edt_code">Code</label>
                        <Tippy content={<span style={{ color: 'white' }}>Genarate new code</span>}>
                            <button onClick={() => {
                                refCode.current.value = "FT" + new Date().getTime()
                            }}><MdAutoAwesome style={styleIcon} /></button>
                        </Tippy>
                    </div>
                    <div className={cx('edt_add', 'edt_name')}>
                        <input ref={refName} placeholder="" id="edt_name" />
                        <label htmlFor="edt_name">Name</label>
                    </div>
                    <div className={cx('edt_add', 'edt_category')}>
                        <Combobox isMulti={false} placeholder={"Select category ..."} options={convertOptionProductCategory()} returnValue={(categoryId) => { updateCategory(categoryId) }} />
                    </div>
                </div>
                <div className={cx('row_2')}>
                    <div className={cx('edits')}>
                        <div className={cx('edt_add', 'edt_price')}>
                            <input onBlur={() => handlePrice()} ref={refPrice} id='price' placeholder="" />
                            <label htmlFor="price">Price</label>
                        </div>
                        <div className={cx('edt_add', 'edt_category')}>
                            <Combobox isMulti={false} placeholder={"Select voucher"} options={vouchers} returnValue={(voucher) => { updateVoucher(voucher) }} />
                        </div>
                        <div className={cx('edt_add_check', 'edt_category')}>
                            <label htmlFor="display">Display page</label>
                            <input ref={refDisplay} id="display" type="checkbox" />
                        </div>
                        <div className={cx('edt_add', 'edt_decs')}>
                            <textarea ref={refDesc} id="desc" placeholder="" />
                            <label htmlFor="desc" >Description</label>
                        </div>
                    </div>
                    <div className={cx('img')}>
                        <input id="file" type="file" style={{ display: "none" }} onChange={(e) => handleUploadImage(e)} />
                        <img onClick={() => {
                            document.getElementById("file").click()
                        }} src={imageUpload || "https://static.thenounproject.com/png/1156518-200.png"} alt="" />
                    </div>
                </div>
                <div className={cx('row_3')}>
                    <button onClick={() => handleSaveProduct()}>Save</button>
                </div>
            </div>
        </div>
    </>);
}

export default AddProduct;