/* eslint-disable react-hooks/exhaustive-deps */
import Tippy from "@tippyjs/react";
import classNames from "classnames/bind";
import React, { useContext, useEffect, useRef, useState } from "react";
import { CiTrash } from "react-icons/ci";
import { processAlert } from "../../../../Components/Alert";
import Combobox from "../../../../Components/Selected";
import { getAllProduct } from "../../../../Data/product";
import { deleteSupplierById, getAllSupplier } from "../../../../Data/supplier";
import { formatDateDMY } from "../../../../Global";
import { DataContext } from "../../../../Provider/DataProvider";
import HeaderProduct from "../HeaderProduct";
import styles from "../index.module.scss";





function ImportProduct() {
    const cx = classNames.bind(styles)
    const styleIcon = { fontSize: '25px' }
    const refName = useRef(null)
    const refPhone = useRef(null)
    const refEmail = useRef(null)
    const refAddress = useRef(null)
    const refTotalPay = useRef(null)
    const [supplier, setSupplier] = useState([])
    const [product, setProduct] = useState([])
    const { user, productCategory } = useContext(DataContext)
    const [productsImport, setProductsImport] = useState(localStorage.getItem("productsImport")
        ? JSON.parse(localStorage.getItem("productsImport")) : [])
    const [productSelectedId, setProductSelectedId] = useState(null)
    const [supplierSelectedId, setSupplierSelectedId] = useState(null)
    const [styleBtnSupplier, setStyleBtnSupplier] = useState(false)
    const [convertOptionSupplier, setConvertOptionSupplier] = useState()

    const fetchData = async (fetchFunction, setDataFunction) => {
        const data = await fetchFunction();
        if (data) {
            setDataFunction(data);
        }
    }

    const fetchSupplierData = () => {
        fetchData(getAllSupplier, setSupplier);
    }

    const fetchProductData = () => {
        fetchData(getAllProduct, setProduct);
    }

    useEffect(() => {
        fetchProductData()
        fetchSupplierData()
    }, [])

    useEffect(() => {
        updateTotalPay()
    }, [productsImport])

    useEffect(() => {
        (supplierSelectedId && Number.isInteger(Number(supplierSelectedId)) && supplierSelectedId.length !== 0) ? setStyleBtnSupplier(true) : setStyleBtnSupplier(false)
    }, [supplierSelectedId])

    const updateTotalPay = () => {
        const totalPay = productsImport?.reduce((accumulator, item) => {
            return accumulator + (item?.product.price * item?.amount);
        }, 0) || 0;
        refTotalPay.current.value = totalPay
    }

    useEffect(() => {
        if (productSelectedId && Number.isInteger(Number(productSelectedId))) {
            setProductsImport((prev) => {
                const productExist = prev.find((item) => Number(item.product.id) === Number(productSelectedId))
                return productExist ?
                    prev.map(item => Number(item.product.id) === Number(productSelectedId) ? { product: item.product, amount: item.amount + 1 } : item)
                    : [...prev, { product: getProductById(productSelectedId), amount: 1 }]
            })
        }
    }, [productSelectedId])

    const returnValueSelectedProduct = (product) => {
        setProductSelectedId(product)
    }

    useEffect(() => {
        if (supplierSelectedId && Number.isInteger(Number(supplierSelectedId))) {
            console.log(supplierSelectedId)
            const supplierSimilar = supplier.find(item => item.id === supplierSelectedId)
            if (supplierSimilar) {
                refName.current.value = supplierSimilar.name
                refEmail.current.value = supplierSimilar.gmail
                refPhone.current.value = supplierSimilar.phone_number
                refAddress.current.value = supplierSimilar.address
            }
        } else {
            refName.current.value = ""
            refEmail.current.value = ""
            refPhone.current.value = ""
            refAddress.current.value = ""
        }
    }, [supplierSelectedId, supplier])

    const returnValueSelectedSupplier = (supplier) => {
        setSupplierSelectedId(supplier)
    }

    useEffect(() => {
        setConvertOptionSupplier(
            supplier.map((s) => ({
                value: s.id,
                label: s.name
            }))
        )
    }, [supplier])

    const convertOptionProduct = () => {
        return product.map((p) => ({
            value: p.id,
            label: p.name
        }))
    }

    const getProductById = (id) => {
        return product.find((item) => item.id === id)
    }

    const getCategoryById = (id) => {
        return productCategory.find((item) => item.id = id)?.name
    }

    const handleSaveTemporarily = () => {
        if (productsImport) {
            localStorage.setItem('productsImport', JSON.stringify(productsImport))
        }
        processAlert("The save is in progress", "Completed in")
    }

    const saveImportInvoice = () => {

    }

    const deleteProduct = (id) => {
        setProductsImport((prev) => {
            return prev?.filter((item) => item.product.id !== id);
        });
    };

    const deleteSupplier = async () => {
        const result = await deleteSupplierById(supplierSelectedId)
        if (result) {
            setSupplierSelectedId()
            fetchSupplierData()
            console.log('deleted')
            document.getElementById("email").innerText = ""
            document.getElementById("name").innerText = ""
            document.getElementById("phone").innerText = ""
        }
    }

    const Row = ({ item, index }) => {
        const inputNumberProduct = useRef(null)

        const handleNumberProduct = (id) => {
            if (isNaN(Number(inputNumberProduct.current.value)) || Number(inputNumberProduct.current.value) === 0) {
                inputNumberProduct.current.value = "1"
            }
            findThenUpdateNumber(id, inputNumberProduct.current.value)
        }

        const findThenUpdateNumber = (id, number) => {
            const newProduct = productsImport.map((item) => {
                if (item.product.id === id) {
                    return { ...item, amount: Number(number) }
                }
                return item;
            })
            setProductsImport(newProduct)
        }


        return <>
            <tr key={index}>
                <td>{item?.product?.name}</td>
                <td>{getCategoryById(item?.product?.category_product_id)}</td>
                <td>{item?.product?.price}</td>
                <td>
                    <input ref={inputNumberProduct} defaultValue={item?.amount} onBlur={() => handleNumberProduct(item.product.id)} />
                </td>
                <td>
                    <button className={cx('delete-button')} onClick={() => deleteProduct(item.product.id)}>
                        <CiTrash style={styleIcon} />
                    </button>
                </td>
            </tr></>
    }

    return (<>
        <div className={cx('product')}>
            <HeaderProduct />
            <div className={cx('import_product')}>
                <div className={cx('row_1')}>
                    <div className={cx('info_import_invoice')}>
                        <div className={cx('edt', 'edt_time_init')}>
                            <input readOnly value={formatDateDMY(new Date())} id="time" placeholder="" />
                            <label htmlFor="time">Time</label>
                        </div>
                        <div className={cx('edt', 'edt_name_user')}>
                            <input readOnly value={user?.id + " - " + user?.name} id="name_user" placeholder="" />
                            <label htmlFor="name_user">Staff</label>
                        </div>
                        <div className={cx('edt', 'edt_total_pay')}>
                            <input ref={refTotalPay} readOnly defaultValue={0 + "VND"} id="total_pay" placeholder="" />
                            <label htmlFor="total_pay">Total pay</label>
                        </div>
                    </div>
                </div>
                <div className={cx('row_2')}>
                    <div className={cx('supplier_form')}>
                        <div className={cx('title_supplier')}>
                            <h4>Supplier Information</h4>
                        </div>
                        <div className={cx('edts_supplier')}>
                            <div className={cx('edt', 'edt_name')}>
                                <input ref={refName} id="name" placeholder="" />
                                <label htmlFor="name">Name store</label>
                            </div>
                            <div className={cx('edt', 'edt_email')}>
                                <input ref={refEmail} id="email" placeholder="" />
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className={cx('edt', 'edt_phone')}>
                                <input ref={refPhone} id="phone" placeholder="" />
                                <label htmlFor="phone">Phone number</label>
                            </div>
                            <div className={cx('edt', 'edt_address')}>
                                <input ref={refAddress} id="address" placeholder="" />
                                <label htmlFor="address">Address</label>
                            </div>
                            <div className={cx('edt')}>
                                <Combobox placeholder={"Select supplier already exist"} options={convertOptionSupplier} returnValue={returnValueSelectedSupplier} />
                            </div>
                            <div className={cx('btns')}>
                                <Tippy content="Selected supplier then you can delete">
                                    <button onClick={() => {
                                        deleteSupplier()
                                    }} className={cx(styleBtnSupplier ? 'btnDeleteSpl_on' : 'btnDeleteSpl_off')} >Delete</button>
                                </Tippy>
                            </div>
                        </div>
                    </div>
                    <div className={cx('table_import_product')}>
                        <div className={cx('sl_product')}>
                            <Combobox placeholder={"Select product ..."} options={convertOptionProduct()} isMulti={false} returnValue={returnValueSelectedProduct} width={200} />
                            <button onClick={() => {
                                handleSaveTemporarily()
                            }}>Save temporarily</button>
                            <button className={cx('remove_all')} onClick={() => {
                                localStorage.removeItem("productsImport")
                                setProductsImport([])
                            }}>Remove all</button>
                        </div>
                        <div className={cx('table')}>
                            <table>
                                <thead>
                                    <tr>
                                        <td>name</td>
                                        <td>category</td>
                                        <td>price</td>
                                        <td>amount</td>
                                        <td>delete</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        productsImport?.map((item, index) => {
                                            return (
                                                <Row item={item} index={index} />
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className={cx('row_3')}>
                    <button onClick={() => saveImportInvoice()}>Save import invoice</button>
                </div>
            </div>
        </div>
    </>);
}

export default ImportProduct;