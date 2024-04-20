import classNames from "classnames/bind";
import React, { useContext, useEffect, useRef, useState } from "react";
import { CiTrash } from "react-icons/ci";
import { GiSaveArrow } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { errorAlert, processAlert, successAlert, warningAlert } from "../../../../Components/Alert";
import { getAllProduct, updateProduct } from "../../../../Data/product";
import { DataContext } from "../../../../Provider/DataProvider";
import BoxImages from "../../BoxImages";
import HeaderProduct from "../HeaderProduct";
import styles from "../index.module.scss";

function UpdateProduct() {

    const cx = classNames.bind(styles)
    const styleIcon = { fontSize: '25px' }

    const [product, setProduct] = useState([])
    const [productRender, setProductRender] = useState([])
    const { productCategory } = useContext(DataContext)

    const [categoryForm, setCategoryForm] = useState(-1)
    const [updateImages, setUpdateImages] = useState(-1)


    const fetchData = async () => {
        const data = await getAllProduct();
        if (data) {
            setProduct(data)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        setProductRender(product)
    }, [product])


    const getCategoryName = (category_product_id) => {
        return productCategory.find(item => item.id === category_product_id)?.name;
    }

    //     const handleSearch = () => {
    //         const searchKey = ipSearch.current.value
    //         const searchFilter = product.filter(item => {
    //             const id = item.id.toString().toLowerCase()
    //             const code = item.code.toString().toLowerCase()
    //             const name = item.name.toString().toLowerCase()
    //             const categoryName = getCategoryName(item.category_product_id).toString().toLowerCase()
    //             const price = item.price.toString().toLowerCase()
    //             const amount = item.amount.toString().toLowerCase()
    //             const voucher = item.voucher.toString().toLowerCase()
    // 
    //             return (
    //                 id.includes(searchKey) ||
    //                 code.includes(searchKey) ||
    //                 name.includes(searchKey) ||
    //                 categoryName.includes(searchKey) ||
    //                 price.includes(searchKey) ||
    //                 amount.includes(searchKey) ||
    //                 voucher.includes(searchKey)
    //             );
    //         }
    //         );
    //         setProductRender(searchFilter)
    //     }

    const funcCallBack = (product_id, category_id) => {
        if (category_id) {
            setProduct((prev) => (
                prev.map((item) => {
                    if (item.id === product_id) {
                        return {
                            ...item,
                            category_product_id: category_id
                        };
                    }
                    return item;
                })
            ));
        }
        setCategoryForm(-1)
    }


    const ShowCategoryForm = ({ id, funcCallBack }) => {
        return <>
            <div className={cx('category-form')}>
                <div className={cx('title-category')}>
                    Danh sách các loại cây
                    <IoClose style={styleIcon} onClick={() => { funcCallBack() }} />
                </div>
                <div className={cx('categorys')}>
                    {
                        productCategory?.map((category, index) => (
                            <div key={index} className={cx('category')} onClick={() => {
                                funcCallBack(id, category?.id)
                            }}>
                                <span>{getCategoryName(category.id)}</span>
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    }

    const Row = ({ item }) => {
        const name = useRef(null)
        const desc = useRef(null)
        const price = useRef(null)
        const amount = useRef(null)
        const voucher = useRef(null)
        const display = useRef(null)

        const handleUpdateProduct = async () => {
            const nameEdt = name.current.value
            const categoryEdt = item.category_product_id
            const descEdt = desc.current.value
            const priceEdt = price.current.value
            const amountEdt = amount.current.value
            const voucherEdt = voucher.current.value
            if(nameEdt === "" || descEdt === "" || categoryEdt === ""){
                warningAlert("Please, check information and try update again!")
                return;
            }
            if(Number(priceEdt) < 0 || amountEdt < 0){
                warningAlert("Price, amount must be greater than or equal to 0")
                return;
            }
            if(Number(voucherEdt) < 0 || Number(voucherEdt) > 1){
                warningAlert("Voucher must be between 0 and 1")
                return;
            }
            processAlert("The update is in progress", "Completed in");
            const resultUpdate = await updateProduct({
                id: item?.id,
                name: name.current.value,
                category: item.category_product_id,
                desc: desc.current.value,
                price: price.current.value,
                amount: amount.current.value,
                voucher: voucher.current.value,
                display: display.current.checked
            })

            if (resultUpdate === true) {
                fetchData()
                setTimeout(() => {
                    successAlert("Update successful")
                }, 1000);
            }else{
                errorAlert(resultUpdate)
            }
        }


        return <>
            <tr>
                <td>{item?.id}</td>
                <td>{item?.code}</td>
                <td>
                    <input ref={name} defaultValue={item?.name} />
                </td>
                <td>
                    <textarea ref={desc} defaultValue={item?.description} />
                </td>
                <td>
                    <div className={cx('categoty-name')}
                        onClick={() => setCategoryForm(item?.id)}
                    >
                        {getCategoryName(item?.category_product_id)}
                    </div>
                </td>
                <td>
                    <img src={item?.image || "https://cdn-icons-png.freepik.com/512/100/100662.png"} alt="" />
                    <button
                        onClick={() => {
                            setUpdateImages(item?.id)
                        }}
                    >See more images</button>
                </td>
                <td><input ref={price} defaultValue={item?.price} /></td>
                <td><input ref={amount} defaultValue={item?.amount} /></td>
                <td><input ref={voucher} defaultValue={item?.voucher} /></td>
                <td>
                    <input ref={display} type="checkbox" defaultChecked={item?.display} />
                </td>
                <td>
                    <GiSaveArrow style={styleIcon} onClick={() => handleUpdateProduct()} />
                </td>
                <td>
                    <CiTrash style={styleIcon} />
                </td>
            </tr>
        </>
    }

    return (<>
        {updateImages !== -1 && <BoxImages id={updateImages} funcCallBack={() => {
            setUpdateImages(-1)
            fetchData()
        }}/>}

        {
        updateImages === -1 && <div className={cx('product')}>
            <HeaderProduct />
            <div className={cx('table')}>
                {categoryForm !== -1 && <ShowCategoryForm id={categoryForm} funcCallBack={funcCallBack} />}
                <table>
                    <thead>
                        <tr>
                            <td>id</td>
                            <td>code</td>
                            <td>name</td>
                            <td>description</td>
                            <td>category</td>
                            <td>image</td>
                            <td>price</td>
                            <td>amount</td>
                            <td>voucher (%)</td>
                            <td>display</td>
                            <td>update</td>
                            <td>delete</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            (productRender)?.map((item, index) => (
                                <Row key={index} item={item} />
                            ))
                        }
                        {
                            productRender.length === 0 && (
                                <tr className={cx('no-data')}>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>Không có</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
        }
    </>);
}

export default UpdateProduct;