import Tippy from '@tippyjs/react';
import classNames from "classnames/bind";
import React, { useContext, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
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
    const [imageUpload, setImageUpload] = useState(null)
    const [category, setCategory] = useState(null)
    const [voucher, setVoucher] = useState(null)

    const [code, setCode] = useState("")
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [display, setDisplay] = useState("")
    const [desc, setDesc] = useState("")
    const [imageLoad, setImageLoad] = useState(false)
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
        setImageLoad(true)
        if (imageUpload) {
            handleDeleteImageFb(imageUpload)
        }
        const resultUpload = await handleImageUploadFb(e)
        setImageLoad(false)
        if (resultUpload !== 'error') {
            setImageUpload(resultUpload)
        }
    }

    const refreshForm = () => {
        setCode("")
        setName("")
        setPrice("")
        setDisplay(false)
        setDesc("")
        setImageUpload(null)
        setCategory(null)
        setVoucher(null)
    }

    const handlePrice = () => {
        if (isNaN(Number(price))) {
            setPrice("")
        }
    }

    const handleSaveProduct = async () => {
        if (code === null || code === "") {
            warningAlert("Please enter the product code")
            return
        }
        if (name === null || name === "") {
            warningAlert("Please enter the product name")
            return
        }
        if (imageUpload === null || imageUpload === "") {
            warningAlert("Please choose the product image")
            return
        }
        if (voucher?.length === 0 || isNaN(voucher)) {
            warningAlert("Please choose the product voucher")
            return
        }
        if (category?.length === 0 || isNaN(category)) {
            warningAlert("Please choose the product category")
            return
        }
        processAlert("The insert is in progress", "Completed in");
        const result = await insertProduct({
            id: 0,
            code: code,
            name: name,
            image: imageUpload || "",
            category_product_id: category,
            description: desc,
            amount: 0,
            price: price,
            voucher: voucher,
            display: display,
            delete: false
        })
        if (result) {
            refreshForm()
            successAlert("Insert successful");
        } else {
            errorAlert("Insert failed, check data and try again!")
        }
    }

    return (<>
        <div className={cx('product')}>
            <HeaderProduct />
            <div className={cx('add_product')}>
                <div className={cx('row_1')}>
                    <div className={cx('edt_add', 'edt_code')}>
                        <input value={code} onChange={(e) => { setCode(e.target.value) }} placeholder="" id="edt_code" />
                        <label htmlFor="edt_code">Code</label>
                        <Tippy content={<span style={{ color: 'white' }}>Genarate new code</span>}>
                            <button onClick={() => {
                                setCode("FT" + new Date().getTime())
                            }}><MdAutoAwesome style={styleIcon} /></button>
                        </Tippy>
                    </div>
                    <div className={cx('edt_add', 'edt_name')}>
                        <input value={name} onChange={(e) => { setName(e.target.value) }} placeholder="" id="edt_name" />
                        <label htmlFor="edt_name">Name</label>
                    </div>
                    <div className={cx('edt_add', 'edt_category')}>
                        <Combobox notrenderNull={true} isMulti={false} placeholder={"Select category ..."} options={convertOptionProductCategory()} returnValue={(categoryId) => { updateCategory(categoryId) }} />
                    </div>
                </div>
                <div className={cx('row_2')}>
                    <div className={cx('edits')}>
                        <div className={cx('edt_add', 'edt_price')}>
                            <input onBlur={() => handlePrice()} value={price} onChange={(e) => { setPrice(e.target.value) }} id='price' placeholder="" />
                            <label htmlFor="price">Price</label>
                        </div>
                        <div className={cx('edt_add', 'edt_category')}>
                            <Combobox notrenderNull={true} isMulti={false} placeholder={"Select voucher"} options={vouchers} returnValue={(voucher) => { updateVoucher(voucher) }} />
                        </div>
                        <div className={cx('edt_add_check', 'edt_category')}>
                            <label htmlFor="display">Display page</label>
                            <input checked={display} onChange={() => { setDisplay(!display) }} id="display" type="checkbox" />
                        </div>
                        <div className={cx('edt_add', 'edt_decs')}>
                            <textarea value={desc} onChange={(e) => { setDesc(e.target.value) }} id="desc" placeholder="" />
                            <label htmlFor="desc" >Description</label>
                        </div>
                    </div>
                    <Tippy content="Choose Image">
                        <div className={cx('img')} >
                            {
                                imageLoad && <span className={cx('loading')}><AiOutlineLoading3Quarters style={{ fontSize: '65px', color: 'black' }} /></span>
                            }
                            <input id="file" type="file" style={{ display: "none" }} onChange={(e) => handleUploadImage(e)} />
                            <img className={cx('img-blur')} onClick={() => {
                                !imageLoad && document.getElementById("file").click()
                            }} src={imageUpload || ""} alt="" />
                        </div>
                    </Tippy>
                </div>
                <div className={cx('row_3')}>
                    <button onClick={() => handleSaveProduct()}>Save</button>
                </div>
            </div>
        </div>
    </>);
}

export default AddProduct;