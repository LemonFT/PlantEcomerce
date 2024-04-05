/* eslint-disable react-hooks/exhaustive-deps */
import classNames from "classnames/bind";
import { useContext, useEffect, useRef, useState } from "react";
import Header from "../../Components/Header";
import styles from "./index.module.scss";

import { FiMinus, FiPlus } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import Alert from "../../Components/Alert";
import SideBar from "../../Components/SideBar";
import { addProductToCart, getInfoDetails } from "../../Data/product";
import { DataContext } from "../../Provider/DataProvider";
import Message from "../Message";
function ProductDetails() {

    const cx = classNames.bind(styles)
    const styleIcon = { fontSize: '25px' }
    const [showAlert, setShowAlert] = useState(false)
    const [typeAlert, setTypeAlert] = useState('error')

    const location = useLocation()
    const navigate = useNavigate()
    const params = new URLSearchParams(location.search)
    const inputNumberProduct = useRef(null)
    
    const [product, setProduct] = useState(null)
    const [images, setImages] = useState([])
    const { user, productCategory, updateUrlHistory } = useContext(DataContext)


    useEffect(() => {
        const fetchData = async () => {
            const dt = await getInfoDetails(params?.get("product-id"))
            if (dt != null) {
                const list = dt?.productImages.map(item => item.image);
                setProduct(dt?.product)
                setImages(list)
            }
        }
        fetchData()
    }, [])


    const getCategoryByProductId = (category_product_id) => {
        return productCategory.find(item => item.id === category_product_id);
    }

    const handleFocusImage = (index) => {
        const delay = setTimeout(() => {
            const copiedImages = [...images];
            const itemRemove = copiedImages.splice(index, 1);
            setImages([...copiedImages, itemRemove[0]]);
        }, 0)
        return () => clearTimeout(delay);
    }

    const handleNumberProduct = (e) => {
        if (isNaN(Number(e.target.value)) || Number(e.target.value) === 0) {
            inputNumberProduct.current.value = "1"
        }
    }

    const handleChangeAmount = (plus) => {
        const numNow = Number(inputNumberProduct.current.value)
        if (plus) {
            inputNumberProduct.current.value = numNow + 1;
        } else {
            inputNumberProduct.current.value = numNow > 1 ? numNow - 1 : 1;
        }
    }

    const showErrorAlert = () => {
        setShowAlert(showAlert === false ? true : true)
    }

    const setShowCallBack = () => {
        setShowAlert(false)
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (showAlert) setShowAlert(false)
        }, 2000)
        return () => clearTimeout(timeout)
    }, [showAlert])

    const handleAddCart = async () => {
        if(!user){
            updateUrlHistory(location.pathname + location.search)
            navigate('/register')
        }else{
            const result = await addProductToCart(user.id, product.id, inputNumberProduct.current.value)
            if(result === 1){
                setTypeAlert('success')
                showErrorAlert()
            }else if(result === -1){
                setTypeAlert('error')
                showErrorAlert()
            }
        }
    }

    const Container = () => {
        console.log(product)
        return <>
            <div className={cx('container')}>
                <div className={cx('info')}>
                    <div className={cx('name')}>
                        {product?.name}
                    </div>
                    <div className={cx('category')}>
                        <p><b>Loại cây: </b>{getCategoryByProductId(product?.category_product_id)?.name || ""}</p>
                    </div>
                    <div className={cx('desc')}>
                        <p>
                            {product?.description}
                        </p>
                    </div>
                    <div className={cx('add_to_cart')}>
                        <div className={cx('amount')}>
                            <span className={cx('minus')} onClick={() => handleChangeAmount(false)}>
                                <FiMinus style={styleIcon} />
                            </span>
                            <span className={cx('number')}>
                                <input ref={inputNumberProduct} defaultValue={1} onChange={(event) => handleNumberProduct(event)} />
                            </span>
                            <span className={cx('plus')}>
                                <FiPlus style={styleIcon} onClick={() => handleChangeAmount(true)} />
                            </span>
                        </div>
                        <div className={cx('btn')}>
                            {
                                (product?.amount === 0 || !product?.display) ? <button className={cx('soldout')}>OUT OF STOCK</button> 
                                        : <button className={cx('addcart')} onClick={() => handleAddCart()}>ADD TO CART</button>
                            }
                        </div>
                    </div>
                </div>
                <div className={cx('main_image')}>
                    <img src={images[images.length - 1]} alt="" />
                </div>
                <div className={cx('sub_images')}>
                    {
                        images?.map((item, index) => {
                            return <img key={index} className={cx('sub_image')} src={item} alt="" onClick={() => {
                                handleFocusImage(index)
                            }} />
                        })
                    }
                </div>
            </div>
        </>
    }

    return (<>
        <Header />
        {user && <Message />}
        <SideBar />
        {
            showAlert && <Alert 
            content={typeAlert === 'error' ? "Please check your internet again!" : "Add to cart successfully"}
            type={typeAlert === 'error' ? 'error' : 'success'}
            title={typeAlert === 'error' ? 'error' : 'success'}
            setShow={setShowCallBack}
            centerVertical={true}/>
        }
        <Container />
    </>);
}

export default ProductDetails;