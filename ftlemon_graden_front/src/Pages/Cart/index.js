/* eslint-disable react-hooks/exhaustive-deps */
import classNames from "classnames/bind";
import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";

import { BsPen } from "react-icons/bs";
import { CiLocationOn, CiPhone, CiSquareCheck, CiTrash } from "react-icons/ci";
import { FiMinus, FiPlus } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { RiLoader4Fill } from "react-icons/ri";
import { SiCashapp } from "react-icons/si";


import { Link, useNavigate } from "react-router-dom";
import { errorAlert, submitCancelOkAlert, successAlert, warningAlert } from "../../Components/Alert";
import { deleteOrder, getAllOrdersByUserId, paymentOrder, saveOrder, updateExchangeProgressing, updateStatusOrder } from "../../Data/order";
import { deleteAllProductInCart, deleteProductInCart, getCart } from "../../Data/product";
import { getVerificationEmailCode } from "../../Data/user";
import { compareString, encryptString, formatDate, isVietnamesePhoneNumber } from "../../Global";
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
    const [showFormContact, setShowFormContact] = useState(false)
    const [contactSaved, setContactSaved] = useState(null)
    const [showCart, setShowCart] = useState(true)
    const [addressSave, setAddressSave] = useState("")
    const [phoneSave, setPhoneSave] = useState("")
    const [mailCodeSave, setMailCodeSave] = useState("")
    const [typePay, setTypePay] = useState(1)


    useEffect(() => {
        if (ipAdress) {
            ipAdress?.current?.focus()
        }
    }, [addressSave])

    useEffect(() => {
        if (ipPhone) {
            ipPhone?.current?.focus()
        }
    }, [phoneSave])

    useEffect(() => {
        if (ipEmailCode) {
            ipEmailCode?.current?.focus()
        }
    }, [mailCodeSave])

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        if (localStorage.getItem("orderId") !== null && urlParams.has('vnp_status')) {
            const orderId = localStorage.getItem("orderId");
            if (urlParams.get('vnp_status').toString() === '200') {
                const transaction_no = urlParams.get('vnp_transaction_no');
                successAlert("Transaction with VNPay successful")
                setTimeout(() => {
                    saveTransactionVnPay(orderId, transaction_no, urlParams);
                }, 1000);
            } else {
                setTimeout(() => {
                    handleDeleteOrder(orderId);
                }, 1000);
            }
        } else if (localStorage.getItem("orderId") && !urlParams.has('vnp_status')) {
            setTimeout(() => {
                handleDeleteOrder(localStorage.getItem("orderId"));
            }, 1000);
        }
    }, []);


    useEffect(() => {
        const fetchCart = async () => {
            try {
                if (!user) {
                    window.location.href = "/register"
                }
                const dt = await getCart(user?.id)
                if (dt != null) {
                    setProduct(dt)
                }
            } catch (error) { }
        }
        fetchCart()
    }, [])

    useEffect(() => {
        if (contactSaved !== null) {
            setAddressSave(contactSaved.address)
            setPhoneSave(contactSaved.phone_number)
        }
    }, [contactSaved])

    const saveTransactionVnPay = async (orderId, transaction_no, urlParams) => {
        const data = {
            orderId: orderId,
            exchange: {
                transactionNo: transaction_no,
                payTypeId: 2
            }
        }
        const resultUpdateExchangeProgressing = await updateExchangeProgressing(data)
        if (resultUpdateExchangeProgressing) {
            urlParams.delete('vnp_status');
            urlParams.delete('vnp_transaction_no')
            handleRemoveAllProduct(user?.id)
            localStorage.removeItem("orderId")
            const newUrl = window.location.pathname + urlParams.toString();
            window.history.pushState({}, '', newUrl);
        }
    }

    const handleDeleteOrder = async (orderId) => {
        if (orderId) {
            const resultDeleteOrder = await deleteOrder(orderId)
            if (resultDeleteOrder) {
                errorAlert("Transaction failed, please try again later")
                localStorage.removeItem("orderId")
            }
        }
    }

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
        await deleteAllProductInCart(user_id)
        setProduct([])
    }

    const payWithVnpay = async () => {
        const urlPayment = await paymentOrder(getTotalPay());
        if (urlPayment !== "") {
            window.location.href = urlPayment
        } else {
            errorAlert("Payment order redirection failed, please check your internet connection again.")
        }
    }

    const getCode = async () => {
        document.getElementById('text').style.display = 'none'
        document.getElementById('icon_loading').style.display = 'block'
        if (product.length === 0 || getTotalPay() === 0) {
            warningAlert("No products available yet!")
            return
        }
        const code = await getVerificationEmailCode(user?.email)
        localStorage.setItem('verificode', JSON.stringify(encryptString(code, process.env.REACT_APP_SECRETKEY)));
        document.getElementById('icon_loading').style.display = 'none'
        document.getElementById('text').style.display = 'block'
    }

    const savePayment = async () => {
        if (product.length === 0 || getTotalPay() === 0) {
            warningAlert("No products available yet!")
            return
        }
        if (addressSave === "" || phoneSave === "" || mailCodeSave === "") {
            warningAlert("Check contact information and try again later!")
            return
        }
        if (!isVietnamesePhoneNumber(phoneSave)) {
            warningAlert("Phone number invalid!")
            return
        }
        if (!JSON.parse(localStorage.getItem('verificode')) || !compareString(mailCodeSave, JSON.parse(localStorage.getItem('verificode')), process.env.REACT_APP_SECRETKEY)) {
            warningAlert("Verification Email code failed!")
            return
        }


        const data = {
            order: {
                userReceiveId: user?.id,
                address: addressSave,
                phoneNumber: phoneSave,
                totalPay: getTotalPay(),
                payTypeId: typePay
            },
            orderItems: product.map((item) => {
                return {
                    productId: item.product.id,
                    number: item.number,
                    price: item.product.price,
                    voucher: item.product.voucher
                }
            })
        }
        const resultSaveOrder = await saveOrder(data)
        if (resultSaveOrder === "0") {
            errorAlert("I sincerely apologize, the product has expired!")
        } else {
            localStorage.removeItem('verificode')
            localStorage.setItem('orderId', resultSaveOrder)
            if (typePay === 2) {
                payWithVnpay()
            } else {
                localStorage.removeItem('orderId')
                localStorage.removeItem('verificode')
                handleRemoveAllProduct(user?.id)
                successAlert("Order placed successfully")
            }
        }
    }

    const ItemCart = ({ item, number }) => {
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
                        <input ref={inputNumberProduct} id="number" defaultValue={number} onBlur={() => handleNumberProduct()} />
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

    const Cart = () => {
        return <>
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
                        return <ItemCart key={index} item={item?.product} number={item?.number} />
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
                                <input onChange={() => setTypePay(1)} type="radio" name="typepay" id="payafter" value={"Thanh toán sau khi nhận hàng"} defaultChecked={typePay === 1} />
                                <label htmlFor="payafter" >Thanh toán sau khi nhận hàng</label>
                                <span htmlFor="payafter"><img src={payafter} alt="" /></span>
                            </div>

                            <div className={cx('vnpay')}>
                                <input onChange={() => setTypePay(2)} type="radio" name="typepay" id="vnpay" value={"Thanh toán qua VNPay"} defaultChecked={typePay === 2} />
                                <label htmlFor="vnpay">Thanh toán qua VNPay</label>
                                <span htmlFor="vnpay"><img className={cx('vnpayimg')} src={vnpay} alt="" /></span>
                            </div>
                        </div>
                        <div className={cx('form-information')}>
                            {showFormContact && <FormContact functionCallBack={(contact) => {
                                setContactSaved(contact)
                                setShowFormContact(false)
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
                                <input ref={ipAdress} id="ip-address" value={addressSave} onChange={(e) => setAddressSave(e.target.value)} />
                                <label htmlFor="ip-address">Address</label>
                            </div>
                            <div className={cx('box-input')}>
                                <input ref={ipPhone} id="ip-phoneNum" value={phoneSave} onChange={(e) => setPhoneSave(e.target.value)} />
                                <label htmlFor="ip-phoneNum">Phone number</label>
                            </div>
                            <div className={cx('box-input')}>
                                <input ref={ipEmailCode} id="ip-emailCode" value={mailCodeSave} onChange={(e) => setMailCodeSave(e.target.value)} />
                                <label htmlFor="ip-emailCode">Verification email</label>
                            </div>
                            <div className={cx('total-pay')}>
                                <span>Total payment: {getTotalPay()} VNĐ</span>
                            </div>
                            <div className={cx('save-contact')}>
                                <button className={cx('btn_getcode')} onClick={() => { getCode() }}>
                                    <span id="text" >Get Verification Email</span>
                                    <span id="icon_loading">
                                        <RiLoader4Fill style={styleIcon} />
                                    </span>
                                </button>
                            </div>
                        </div>
                        <div className={cx('total_and_pay')}>
                            <button className={cx('btn-pay')} onClick={() => savePayment()}>
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
        </>
    }

    const ItemOrder = ({ item, index, fetchOrder }) => {

        const getTotalPayOrder = () => {
            return item?.orderItemProducts?.reduce((total, item) => {
                if (item && typeof item === 'object') {
                    const { number, voucher, price } = item;
                    if (typeof number === 'number' && typeof voucher === 'number' && typeof price === 'number') {
                        total += number * (1 - voucher) * price;
                    }
                }
                return total;
            }, 0);
        }

        const cancelOrder = async () => {
            submitCancelOkAlert(async () => {
                const result = await updateStatusOrder(item?.order?.id, 4)
                if (result === true) {
                    successAlert("Cancel order successful")
                    fetchOrder()
                } else {
                    errorAlert("Cancel order failed!")
                }
            }, "Cancel Order")
        }


        return (
            <div className={cx('item')} key={index}>
                <div className={cx('order-id')}>{item?.order?.code}</div>
                <div className={cx('order-time')}>{formatDate(new Date(item?.order?.initTime))}</div>
                {item.progressingOrder.statusOrder === 5 && <div className={cx('order-status')}>There was a problem with the store, so your order was canceled, we will contact you as soon as possible</div>}
                <div className={cx('product-list')}>
                    {
                        item?.orderItemProducts?.map((orderItem, index) => {
                            return <>
                                <div className={cx('product')} key={index}>
                                    <span className={cx('product-name')}>{orderItem?.productName}</span>
                                    <span className={cx('product-quantity')}>x{orderItem?.number}</span>
                                    <span className={cx('product-voucher')}>{orderItem?.voucher !== 0 ? ("-" + orderItem?.voucher * 100 + "%") : "-0%"}</span>
                                    <span className={cx('product-price')}>Total: {(orderItem?.number * (1 - orderItem?.voucher) * orderItem?.price)} VND</span>
                                </div>
                            </>
                        })
                    }
                </div>
                <div className={cx('order-information')}>
                    <div className={cx('order-total')}>
                        <span><SiCashapp style={styleIcon} /></span>
                        <span>Total Payment: {getTotalPayOrder()} VND</span>
                    </div>
                    <div className={cx('paid')}>
                        <span>
                            <CiSquareCheck style={styleIcon} />
                        </span>
                        <span>
                            {item?.progressingOrder?.exchangeId !== null ? "Paid" : "Unpaid"}
                        </span>
                    </div>
                    <div className={cx('address')}>
                        <span><CiLocationOn style={styleIcon} /></span>
                        <span>Address: {item?.order?.address}</span>
                    </div>
                    <div className={cx('phone-num')}>
                        <span><CiPhone style={styleIcon} /></span>
                        <span>Phone number: {item?.order?.phoneNumber}</span>
                    </div>
                </div>
                {
                    item?.progressingOrder?.statusOrder === 0 &&
                    <div className={cx('btn-group')} >
                        <button className={cx('cancel-btn')} onClick={() => {
                            cancelOrder()
                        }}>Cancel Order</button>
                        {/* <button className={cx('update-address-btn')} onClick={() => {
                            updateContact()
                        }}>Update Contact</button> */}
                    </div>
                }
            </div>
        );
    };

    const Order = () => {
        const [orders, setOrders] = useState([])
        const [ordersRender, setOrdersRender] = useState([])
        const [headerItem, setHeaderItem] = useState(1)

        const fetchOrder = async () => {
            const ords = await getAllOrdersByUserId(user?.id)
            if (ords !== null) {
                setOrders(ords)
            }
        }

        useEffect(() => {
            fetchOrder()
        }, [])

        useEffect(() => {
            if (!orders) return;
            const filteredOrders = orders.filter(item => {
                if (headerItem === 5) {
                    return item?.progressingOrder?.statusOrder === 4 || item?.progressingOrder?.statusOrder === 5
                }
                return (item?.progressingOrder?.statusOrder) === (headerItem - 1)
            });
            setOrdersRender(filteredOrders);
        }, [orders, headerItem]);
        return <>
            <div className={cx('order')}>
                <div className={cx('back-shopping')}>
                    <Link to={"/products"}>
                        <span><MdOutlineArrowBackIosNew style={styleIcon} /></span>
                        <span>Shopping Continue</span>
                    </Link>
                </div>
                <div className={cx('header')}>
                    <div className={cx('header_item')} style={headerItem === 1 ? { borderBottom: '5px solid green' } : {}}
                        onClick={() => setHeaderItem(1)}>Ordered{headerItem === 1 && "(" + ordersRender.length + ")"}
                    </div>
                    <div className={cx('header_item')} style={headerItem === 2 ? { borderBottom: '5px solid green' } : {}}
                        onClick={() => setHeaderItem(2)}>Being packaged{headerItem === 2 && "(" + ordersRender.length + ")"}
                    </div>
                    <div className={cx('header_item')} style={headerItem === 3 ? { borderBottom: '5px solid green' } : {}}
                        onClick={() => setHeaderItem(3)}>Being transported{headerItem === 3 && "(" + ordersRender.length + ")"}
                    </div>
                    <div className={cx('header_item')} style={headerItem === 4 ? { borderBottom: '5px solid green' } : {}}
                        onClick={() => setHeaderItem(4)}>Complete{headerItem === 4 && "(" + ordersRender.length + ")"}
                    </div>
                    <div className={cx('header_item')} style={headerItem === 5 ? { borderBottom: '5px solid green' } : {}}
                        onClick={() => setHeaderItem(5)}>Cancel{headerItem === 5 && "(" + ordersRender.length + ")"}
                    </div>
                </div>
                <div className={cx('items')}>
                    {
                        ordersRender && ordersRender?.map((item, index) => {
                            return <ItemOrder item={item} index={index} fetchOrder={() => { fetchOrder() }} />
                        })
                    }
                    {
                        (!ordersRender || ordersRender?.length === 0) && <>
                            <div className={cx('no_data')}>
                                <span>NO DATA</span>
                            </div>
                        </>
                    }
                </div>
            </div>
        </>
    }

    return (
        <>
            <div className={cx('cart')}>
                <h2 className={cx('title')}>
                    <span onClick={() => setShowCart(true)} style={showCart ? { color: 'black', textShadow: '2px 2px 2px #000' } : {}}>Cart</span>
                    <span>/</span>
                    <span onClick={() => setShowCart(false)} style={!showCart ? { color: 'black', textShadow: '2px 2px 2px #000' } : {}}>Order</span>
                </h2>
                {showCart && <Cart />}
                {!showCart && <Order />}

            </div>
        </>
    );
}

export default Cart;