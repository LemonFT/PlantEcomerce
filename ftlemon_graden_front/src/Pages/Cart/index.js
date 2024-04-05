/* eslint-disable react-hooks/exhaustive-deps */
import classNames from "classnames/bind";
import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";

import { BsPen } from "react-icons/bs";
import { CiTrash } from "react-icons/ci";
import { FiMinus, FiPlus } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineArrowBackIosNew } from "react-icons/md";



import { Link, useNavigate } from "react-router-dom";
import Loading from "../../Components/Loading";
import { deleteAllProductInCart, deleteProductInCart, getCart } from "../../Data/product";
import payafter from '../../Images/payment.png';
import sadIcon from '../../Images/sad.png';
import vnpay from '../../Images/vnpay.png';
import { DataContext } from "../../Provider/DataProvider";
import FormContact from "../FormContact";
function Cart() {
    const cx = classNames.bind(styles)
    const styleIcon = { fontSize: '25px' }
    const navigate = useNavigate()
    const ipAdress = useRef(null)
    const ipPhone = useRef(null)
    const ipEmailCode = useRef(null)
    const privacy = [
        {
            section: "Phương thức thanh toán",
            content: [
                "Chúng tôi chấp nhận thanh toán qua các phương thức sau: thẻ tín dụng, thẻ ghi nợ, chuyển khoản ngân hàng và các phương thức thanh toán trực tuyến khác được chấp nhận.",
                "Thẻ tín dụng và thẻ ghi nợ sẽ được xử lý thông qua cổng thanh toán an toàn và được mã hóa để bảo vệ thông tin cá nhân của bạn."
            ]
        },
        {
            section: "Thanh toán an toàn",
            content: [
                "Chúng tôi cam kết bảo vệ thông tin thanh toán của bạn bằng cách sử dụng các biện pháp an ninh hàng đầu. Tuy nhiên, chúng tôi không chịu trách nhiệm đối với mọi rủi ro phát sinh do việc truy cập trái phép vào thông tin thanh toán.",
                "Bất kỳ thông tin thanh toán nào được nhập trên trang web của chúng tôi sẽ được mã hóa bằng công nghệ SSL để đảm bảo tính bảo mật tối đa."
            ]
        },
        {
            section: "Xác nhận đơn hàng",
            content: [
                "Bạn sẽ nhận được một xác nhận qua email ngay sau khi thanh toán hoàn tất. Xin lưu ý rằng xác nhận này chỉ là một xác nhận tự động và không thể coi là xác nhận cuối cùng về việc xử lý đơn hàng của bạn.",
                "Trong trường hợp có bất kỳ vấn đề nào liên quan đến thanh toán của bạn, chúng tôi sẽ liên hệ với bạn để xác minh thông tin trước khi xử lý đơn hàng."
            ]
        },
        {
            section: "Hủy đơn hàng và hoàn tiền",
            content: [
                "Bạn có thể yêu cầu hủy đơn hàng hoặc hoàn tiền trong vòng thời gian nhất định sau khi đặt hàng, tùy thuộc vào chính sách hủy và hoàn tiền của chúng tôi.",
                "Thời gian xử lý hủy đơn hàng và hoàn tiền có thể biến động và sẽ được thông báo rõ ràng trong quy trình hủy."
            ]
        },
        {
            section: "Phí và thuế",
            content: [
                "Mọi phí và thuế liên quan đến đơn hàng sẽ được hiển thị rõ ràng trước khi bạn xác nhận thanh toán.",
                "Bạn chịu trách nhiệm thanh toán tất cả các phí và thuế áp dụng đối với đơn hàng của mình."
            ]
        }];
    const { user } = useContext(DataContext)
    const [product, setProduct] = useState([])
    const [privacyShow, setPrivacyShow] = useState(false)
    const [showLoading, setShowLoading] = useState(false)
    const [showFormContact, setShowFormContact] = useState(false)
    const [contactSaved, setContactSaved] = useState(null)

    useEffect(() => {
        const fetchCart = async () => {
            try {
                if (!user) {
                    window.location.href = "/register"
                }
                const dt = await getCart(user?.id)
                if (dt != null) {
                    setProduct(dt)
                    console.log(dt)
                }
            } catch (error) { }
        }
        fetchCart()
    }, [])

    useEffect(() => {
        if (contactSaved !== null) {
            ipAdress.current.value = contactSaved.address
            ipPhone.current.value = contactSaved.phone_number
        }
    }, [contactSaved])

    const findThenUpdateNumber = (id, number) => {
        const newProduct = product.map((item) => {
            if (item.product.id === id) {
                return { ...item, number: Number(number) }
            }
            return item;
        })
        setProduct(newProduct)
    }

    const getTotalPay = () => {
        let total_pay = 0;
        product.forEach((item) => {
            const voucher = Number(item.product.voucher)
            total_pay += item.number * (item.product.price - item.product.price * voucher)
        })
        return total_pay
    }

    const handleRemoveAllProduct = async (user_id) => {
        setShowLoading(true)
        await deleteAllProductInCart(user_id)
        setProduct([])
        const timeout = setTimeout(() => {
            setShowLoading(false)
        }, 1000)
        return () => clearTimeout(timeout)
    }

    const Item = ({ item, number }) => {
        const [removeItem, setRemoveItem] = useState(false);
        const inputNumberProduct = useRef(null);
        const handleRemoveProduct = (user_id, product_id) => {
            const deleteProduct = async () => {
                const result = await deleteProductInCart(user_id, product_id)
                if (result === 1) {
                    setRemoveItem(true)
                    const dt = await getCart(user?.id)
                    if (dt != null) {
                        setProduct(dt)
                    }
                }
            }
            deleteProduct()
        }

        const handleNumberProduct = () => {
            if (isNaN(Number(inputNumberProduct.current.value)) || Number(inputNumberProduct.current.value) === 0) {
                inputNumberProduct.current.value = "1"
            }
            findThenUpdateNumber(item.id, inputNumberProduct.current.value)
        }

        const handleChangeAmount = (plus) => {
            const numNow = Number(inputNumberProduct.current.value)
            if (plus) {
                inputNumberProduct.current.value = numNow + 1;
            } else {
                inputNumberProduct.current.value = numNow > 1 ? numNow - 1 : 1;
            }
            findThenUpdateNumber(item.id, inputNumberProduct.current.value)
        }

        const navigateDetails = (id, code, name) => {
            navigate(`/productdetails?product-id=${id}&code=${code}&name=${name}`)
        }

        return <>
            <div className={removeItem ? cx('item', 'item_remove') : cx('item')}>
                <div className={cx('image')}>
                    <img src={item?.image} alt=""></img>
                </div>
                <div className={cx('info')}>
                    <h4 className={cx('text')}>
                        {item?.name}
                    </h4>
                    <button className={cx('see-details')} onClick={() => navigateDetails(item.id, item.code, item.name)}>
                        Click see Details
                    </button>
                </div>
                <div className={cx('amount')}>
                    <span className={cx('minus')} onClick={() => handleChangeAmount(false)}>
                        <FiMinus style={styleIcon} />
                    </span>
                    <span className={cx('number')}>
                        <input ref={inputNumberProduct} defaultValue={number} onChange={(event) => handleNumberProduct(event)} />
                    </span>
                    <span className={cx('plus')}>
                        <FiPlus style={styleIcon} onClick={() => handleChangeAmount(true)} />
                    </span>
                </div>
                <div className={cx('price')}>
                    <span className={cx('price-default')} style={item.voucher === 0 ? {} : { textDecoration: 'line-through' }}>
                        {item.price} vnđ
                    </span>
                    {
                        item.voucher !== 0 && <span>-{item.voucher * 100}%</span>
                    }
                    <span className={cx('price-voucher')}>
                        {item.voucher === 0 ? "" : (Number(item.price) - Number(item.voucher * item.price)) + " vnđ"}
                    </span>
                </div>
                <div className={cx('trash')} >
                    <span>
                        <CiTrash style={styleIcon} onClick={() => {
                            handleRemoveProduct(user?.id, item?.id)
                        }} />
                    </span>
                </div>
                <img className={cx('sadicon')} src={sadIcon} alt="" />
            </div>
        </>
    }


    return (
        <>
            {showLoading && <Loading />}
            <div className={cx('cart')}>
                <h2 className={cx('title')}>Cart</h2>
                <div className={cx('back-shopping')}>
                    <Link to={"/products"}>
                        <span><MdOutlineArrowBackIosNew style={styleIcon} /></span>
                        <span>Shopping Continue</span>
                    </Link>
                </div>
                <div className={cx('remove_all')}>
                    <button onClick={() => handleRemoveAllProduct(user?.id)}>Xóa tất cả</button>
                </div>
                <div className={cx('products')}>
                    {
                        product?.map((item, index) => {
                            return <Item key={index} item={item?.product} number={item?.number} />
                        })
                    }
                    {product.length === 0 && (
                        <Link to={"/products"}><button className={cx('backshopping')}>Back Shopping</button></Link>
                    )}
                </div>
                <div className={cx('pay')}>
                    <div className={cx('typepay_privacy')}>
                        <div className={cx('typepay_pay')}>
                            <div className={cx('typepay')}>
                                <div className={cx('payafter')}>
                                    <input type="radio" name="typepay" id="payafter" value={"Thanh toán sau khi nhận hàng"} />
                                    <label htmlFor="payafter" >Thanh toán sau khi nhận hàng</label>
                                    <span htmlFor="payafter"><img src={payafter} alt="" /></span>
                                </div>

                                <div className={cx('vnpay')}>
                                    <input type="radio" name="typepay" id="vnpay" value={"Thanh toán qua VNPay"} />
                                    <label htmlFor="vnpay">Thanh toán qua VNPay</label>
                                    <span htmlFor="vnpay"><img className={cx('vnpayimg')} src={vnpay} alt="" /></span>
                                </div>
                            </div>
                            <div className={cx('form-information')}>
                                {showFormContact && <FormContact functionCallBack={(contact) => {
                                    setContactSaved(contact)
                                }} />}
                                <span className={cx('active-auto-contact')} onClick={() => {
                                    setShowFormContact(prev => !prev)
                                }}>
                                    <BsPen style={styleIcon} />
                                </span>
                                <div className={cx('title-if')}>
                                    Thông tin người đặt hàng
                                </div>
                                <div className={cx('box-input')}>
                                    <input id="ip-address" ref={ipAdress} />
                                    <label htmlFor="ip-address">Address</label>
                                </div>
                                <div className={cx('box-input')}>
                                    <input id="ip-phoneNum" ref={ipPhone} />
                                    <label htmlFor="ip-phoneNum">Phone number</label>
                                </div>
                                <div className={cx('box-input')}>
                                    <input id="ip-emailCode" ref={ipEmailCode} />
                                    <label htmlFor="ip-emailCode">Verification email</label>
                                </div>
                                <div className={cx('total-pay')}>
                                    <span>Total payment: {getTotalPay()} VNĐ</span>
                                </div>
                                <div className={cx('save-contact')}>
                                    <button>Get code</button>
                                    <button>Save contact</button>
                                </div>
                            </div>
                            <div className={cx('total_and_pay')}>
                                <button className={cx('btn-pay')}>
                                    Thanh toán
                                </button>
                            </div>
                        </div>
                        <div className={cx('privacy')}>
                            <div className={cx('privacy-title')}>
                                <span onClick={() => {
                                    setPrivacyShow(!privacyShow)
                                }}>
                                    Xem điều khoản thanh toán
                                </span>
                                <span onClick={() => {
                                    setPrivacyShow(!privacyShow)
                                }}><IoIosArrowDown style={styleIcon} /></span>
                            </div>
                            <div className={cx('listPrivacy')} style={privacyShow ? { display: 'block' } : { display: 'none' }}>
                                {
                                    privacy?.map((item) => (
                                        <div key={item.section}>
                                            <span className={cx('sub-title-privacy')}>{item.section}</span><br />
                                            {item.content?.map((contentItem) => (
                                                <p key={contentItem}>-{contentItem}</p>
                                            ))}
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Cart;