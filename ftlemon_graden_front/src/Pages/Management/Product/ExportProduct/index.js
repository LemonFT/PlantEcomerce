/* eslint-disable react-hooks/exhaustive-deps */
import classNames from "classnames/bind";
import React, { useContext, useEffect, useRef, useState } from "react";
import { CiTrash } from "react-icons/ci";
import { errorAlert, processAlert, successAlert } from "../../../../Components/Alert";
import Combobox from "../../../../Components/Selected";
import { saveExport } from "../../../../Data/export";
import { getAllProduct } from "../../../../Data/product";
import { formatDateDMY } from "../../../../Global";
import { DataContext } from "../../../../Provider/DataProvider";
import HeaderProduct from "../HeaderProduct";
import styles from "../index.module.scss";


function ExportProduct() {
    const cx = classNames.bind(styles)
    const styleIcon = { fontSize: '25px' }
    const refTotalLoss = useRef(null)
    const [product, setProduct] = useState([])
    const [productsExport, setProductsExport] = useState(localStorage.getItem("productsExport")
    ? JSON.parse(localStorage.getItem("productsExport")) : [])
    const { user, productCategory } = useContext(DataContext)
    const [productSelectedId, setProductSelectedId] = useState(null)

    useEffect(() => {
        fetchProductData()
    }, [])

    const fetchData = async (fetchFunction, setDataFunction) => {
        const data = await fetchFunction();
        if (data) {
            setDataFunction(data);
        }
    }

    const fetchProductData = () => {
        fetchData(getAllProduct, setProduct);
    }

    useEffect(() => {
        if (productSelectedId && Number.isInteger(Number(productSelectedId))) {
            setProductsExport((prev) => {
                const productExist = prev.find((item) => Number(item.product.id) === Number(productSelectedId))
                return productExist ?
                    prev.map(item => Number(item.product.id) === Number(productSelectedId) ? { product: item.product, amount: item.amount + 1 } : item)
                    : [...prev, { product: getProductById(productSelectedId), amount: 1 }]
            })
        }
    }, [productSelectedId])

    useEffect(() => {
        updateTotalPay()
    }, [productsExport])

    const updateTotalPay = () => {
        const totalPay = productsExport?.reduce((accumulator, item) => {
            return accumulator + (item?.product?.price * item?.amount);
        }, 0) || 0;
        refTotalLoss.current.value = totalPay + " VND"
    }

    const deleteProduct = (id) => {
        setProductsExport((prev) => {
            return prev?.filter((item) => item.product?.id !== id);
        });
    };


    const getProductById = (id) => {
        return product.find((item) => item.id === id)
    }

    const returnValueSelectedProduct = (product) => {
        setProductSelectedId(product)
    }

    const getCategoryById = (id) => {
        return productCategory.find((item) => item.id = id)?.name
    }

    const handleSaveTemporarily = () => {
        if (productsExport) {
            localStorage.setItem('productsExport', JSON.stringify(productsExport))
        }
        processAlert("The save is in progress", "Completed in")
    }

    const convertOptionProduct = () => {
        return product.map((p) => ({
            value: p.id,
            label: p.name
        }))
    }

    const saveExportInvoice = () => {
        if(productsExport.length === 0){
            errorAlert("No data import, choose product and try again!")
            return;
        }
        processAlert("The save is in progress", "Completed in")
        setTimeout(async () => {
            const details = productsExport.map((item) => {
                return {
                    export_invoice_id: 0,
                    product_id: item.product.id,
                    number: item.amount,
                    price: item.product.price
                }
            })
            const data = {
                id: 0,
                user_id: user?.id,
                init_time: "",
                total_loss: (refTotalLoss.current.value).replace(" VND", ""),
                details: details
            }
            const result = await saveExport(data)
            if(result){
                successAlert("Insert export invoice successful")
            }else{
                errorAlert("Insert export invoice false, reload page and try again")
            }
        }, 1200)
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
            const newProduct = productsExport.map((item) => {
                if (item.product.id === id) {
                    return { ...item, amount: Number(number) }
                }
                return item;
            })
            setProductsExport(newProduct)
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
            <div className={cx('export_product')}>
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
                            <input ref={refTotalLoss} readOnly defaultValue={0 + "VND"} id="total_pay" placeholder="" />
                            <label htmlFor="total_pay">Total pay</label>
                        </div>
                    </div>
                </div>
                <div className={cx('row_2')}>
                    <div className={cx('table_import_product')}>
                        <div className={cx('sl_product')}>
                            <Combobox placeholder={"Select product ..."} options={convertOptionProduct()} isMulti={false} returnValue={returnValueSelectedProduct} width={200} />
                            <button onClick={() => {
                                handleSaveTemporarily()
                            }}>Save temporarily</button>
                            <button className={cx('remove_all')} onClick={() => {
                                localStorage.removeItem("productsExport")
                                setProductsExport([])
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
                                        productsExport?.map((item, index) => {
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
                    <button onClick={() => {saveExportInvoice()}}>Save export invoice</button>
                </div>
            </div>
        </div>
    </>);
}

export default ExportProduct;

