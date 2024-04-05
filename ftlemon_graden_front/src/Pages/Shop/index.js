/* eslint-disable react-hooks/exhaustive-deps */
import classNames from "classnames/bind";
import React, { useContext, useEffect, useState } from "react";
import Header from "../../Components/Header";
import Combobox from "../../Components/Selected";
import SideBar from "../../Components/SideBar";
import PriceFilter from "../../Components/Slider";
import Message from "../Message";
import styles from "./index.module.scss";

import { CiShoppingCart } from "react-icons/ci";
import { IoIosArrowDropleft, IoIosArrowDropright, IoMdCheckmark } from "react-icons/io";

import { useNavigate } from "react-router-dom";
import Alert from "../../Components/Alert";
import Footer from "../../Components/Footer";
import { addProductToCart, getProducts } from "../../Data/product";
import img01 from "../../Images/1.png";
import img02 from "../../Images/2.png";
import { DataContext } from "../../Provider/DataProvider";


function Shop() {
    const cx = classNames.bind(styles)
    const styleIcon = { fontSize: '25px' }
    const navigate = useNavigate()
    const [showAlert, setShowAlert] = useState(false)
    const [content, setContent] = useState("")

    const { user, maxPrice, productCategory} = useContext(DataContext)
    
    const [data, setData] = useState([])
    const [pageFocus, setPageFocus] = useState(1)
    const [categoryFil, setCategoryFil] = useState([])
    const [searchFil, setSearchFil] = useState("")
    const [priceFilter, setPriceSlider] = useState([0, maxPrice]);
    const NUMBER_PRODUCT_PERPAGE = 20;

    useEffect(() => {
        const fetchData = async () => {
            const dt = await getProducts(1, NUMBER_PRODUCT_PERPAGE, "", null, null, []);
            if(data != null) setData(dt)
        }
        fetchData();
    }, [])

    useEffect(() => {
        handleUpdateFilter()
    }, [pageFocus])
 
    const handleRangeUpdate = (newRange) => {
        setPriceSlider(newRange)
    }

    const handleCategorySelectUpdate = (value) => {
        setCategoryFil(value)
    }

    const handleUpdateFilter = async () => {
        const minNumber = parseInt(priceFilter[0]);
        const maxNumber = parseInt(priceFilter[1]);
        const dt = await getProducts(pageFocus, NUMBER_PRODUCT_PERPAGE, searchFil, 
            Number(minNumber), Number(maxNumber), 
            categoryFil )
        if(dt != null) setData(dt)
    }


    const handlePageNumber = (index, plus, minus) => {
        if (plus) {
            return Math.ceil(data.total_amount / 2) !== pageFocus && setPageFocus(pageFocus + 1)
        }
        if (minus) {
            return 1 !== pageFocus && setPageFocus(pageFocus - 1)
        }
        if (index) return setPageFocus(index)
    }

    const convertOptionProductCategory = () => {
        return productCategory.map(item => ({
            value: item.id,
            label: item.name
        }));
    }

    const showErrorAlert = () => {
        setShowAlert(showAlert === false ? true : true)
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (showAlert) setShowAlert(false)
        }, 2000)
        return () => clearTimeout(timeout)
    }, [showAlert])

    const setShowCallBack = () => {
        setShowAlert(false)
    }

    const Product = ({ className, item }) => {
        const [addCart, setAddCart] = useState(false);
        const [classAfter, setClassAfter] = useState("");
        const {user} = useContext(DataContext)

        useEffect(() => {
            addCart && setClassAfter('item-after')
        }, [addCart])

        const handleAddCart = async () => {
            if(!user){
                navigate('/register')
            }else{
                const result = await addProductToCart(user.id, item.id, 1)
                if(result === 1){
                    setAddCart(true)
                }else if(result === -1){
                    setContent("The product is currently out of stock.")
                    showErrorAlert()
                }else{
                    setContent("Please check your internet again")
                    showErrorAlert()
                }
            }
        }

        const navigateDetails = (id, code, name) => {
            navigate(`/productdetails?product-id=${id}&code=${code}&name=${name}`)
        }
        return <>
            <div className={cx('item', `${className}`, `${classAfter}`)}>
                <button onClick={() => handleAddCart()}>
                    <span className={cx('text')}>
                        {addCart ? "" : "add to cart"}
                    </span>
                    <span className={cx('icon')}>
                        {addCart ? <IoMdCheckmark style={styleIcon} /> : <CiShoppingCart style={styleIcon} />}
                    </span>
                </button>
                <div className={cx("image")} onClick={() => navigateDetails(item?.id, item?.code, item?.name)}>
                    <img loading="lazy" src={item?.image || img02} alt="" />
                </div>
                <div className={cx('info')} onClick={() => navigateDetails(item?.id, item?.code, item?.name)}>
                    <h3 className={cx('name')}>{item.name}</h3>
                    <div className={cx('price')}>
                        <span className={cx('price-default')} style={item.voucher === 0 ? {} : {textDecoration: 'line-through'}}>
                            {item.price} vnđ
                        </span>
                        {
                            item.voucher !== 0 && <span>-{item.voucher*100}%</span>
                        }
                        <span className={cx('price-voucher')}>
                            {item.voucher === 0 ? "" : (Number(item.price) - Number(item.voucher*item.price))+" vnđ"}
                        </span>
                    </div>
                </div>
            </div>
        </>
    }

    return (<>
        {showAlert && <Alert content={content} title={"error"} type={"error"} setShow={setShowCallBack} centerVertical={true} />}
        <Header />
        <SideBar />
        {user && <Message />}
        <div className={cx('shop')}>
            <div className={cx('content_header')}>
                <div className={cx('text')}>
                    <h1>Breath Natural</h1>
                    <p>Bonsai gives sensations
                        Relaxation and peace of mind for the daily living environment. Take advantage of the benefits
                        of bonsai to create a healthy and beautiful living space.</p>
                </div>
                <div className={cx('image')}>
                    <img src={img01} alt="" />
                    <img src={img02} alt="" />
                </div>
            </div>
            <div className={cx('search_filter')}>
                <div className={cx('input_search')}>
                    <input placeholder="Bạn cần tìm gì?" onChange={(e) => {
                        setSearchFil(e.target.value)
                    }}/>
                </div>
                <div className={cx('price_slider')}>
                    <PriceFilter min={0} max={maxPrice} funcGetRange={handleRangeUpdate} />
                </div>
                <div className={cx('category')}>
                    <Combobox options={convertOptionProductCategory()} isMulti={true} closeMenuOnSelect={false} returnValue={handleCategorySelectUpdate}/>
                </div>
            </div>
                <div className={cx('btnFilter')}>
                    <button onClick={() => handleUpdateFilter()}>Update</button>
                </div>
            <div className={cx('products')}>
                {
                    (data?.products)?.map((item, index) => {
                        return <Product className={"item-render"} key={index} item={item} />
                    })
                }
            </div>
            <div className={cx('pages-number')}>
                <span><IoIosArrowDropleft style={styleIcon} onClick={() => handlePageNumber(1, false, true)} /></span>
                {
                    Array.from({ length: Math.ceil(data?.total_amount / 20) }, (_, index) => (
                        <h3 style={pageFocus === index + 1 ? { borderBottomColor: "black" } : { borderBottomColor: "transparent" }} key={index} onClick={() => handlePageNumber(index + 1, false, false)}>
                            {index + 1}
                        </h3>
                    ))
                }
                <span><IoIosArrowDropright style={styleIcon} onClick={() => handlePageNumber(1, true, false)} /></span>
            </div>
        </div>
        <Footer />
    </>);
}

export default Shop;