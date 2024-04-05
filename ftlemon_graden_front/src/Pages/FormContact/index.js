import classNames from "classnames/bind";
import { useContext, useEffect, useRef, useState } from "react";
import { GoPlus } from "react-icons/go";
import { RiUserLocationLine } from "react-icons/ri";
import { getContact, saveContact } from "../../Data/user";
import { DataContext } from "../../Provider/DataProvider";
import styles from "./index.module.scss";
function FormContact({ functionCallBack }) {
    const cx = classNames.bind(styles)
    const styleIcon = { fontSize: '25px' }
    const [showOption, setShowOption] = useState(1)
    const [alert, setAlert] = useState("")

    const { user } = useContext(DataContext)
    const [contacts, setContacts] = useState([])
    const [contactUpdate, setContactUpdate] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            const dt = await getContact(user?.id);
            if (dt !== null) {
                setContacts(dt)
            }
        }
        fetchData()
    }, [user])

    useEffect(() => {
        setTimeout(() => {
            setAlert("")
        }, 2000);
    }, [alert])

    const ItemContact = ({ contact }) => {
        return <>
            <div className={cx('contact')}>
                <div className={cx('icon-location')} onClick={() => {
                    functionCallBack(contact)
                }}>
                    <RiUserLocationLine style={styleIcon} />
                </div>
                <div className={cx('content')}>
                    <div className={cx('category-contact')}>
                        <h4 className={cx('category')} onClick={() => {
                            functionCallBack(contact)
                        }}>{contact.address_category}</h4>
                        <span className={cx('btn-update')} onClick={() => {
                            setContactUpdate({
                                address: contact.address,
                                phone_number: contact.phone_number
                            })
                            setShowOption(3)
                        }}>Chỉnh sửa</span>
                    </div>
                    <div className={cx('address')} onClick={() => {
                        functionCallBack(contact)
                    }}>
                        <span>{contact.address}</span>
                    </div>
                    <div className={cx('phone-number')} onClick={() => {
                        functionCallBack(contact)
                    }}>
                        <span>{contact.phone_number}</span>
                    </div>
                </div>
            </div>
        </>
    }

    const Contact = () => {
        return <>
            <div className={cx('contact-form')}>
                <div className={cx('title-contact-form')}>
                    <h5>Chọn địa chỉ giao hàng</h5>
                </div>
                <div className={cx('btn-add-contact')} onClick={() => setShowOption(2)}>
                    <span><GoPlus style={styleIcon} /></span>
                    <span>Thêm địa chỉ mới</span>
                </div>
                <div className={cx('list-contact')}>
                    {
                        contacts?.map((contact) => (
                            <ItemContact contact={contact} />
                        ))
                    }
                </div>
            </div>
        </>
    }

    function isVietnamesePhoneNumber(number) {
        return /(03|05|07|08|09|01[2689])+([0-9]{8})\b/.test(number);
    }

    const AddContact = () => {
        const ipAddress = useRef(null)
        const ipPhoneNumber = useRef(null)
        const ipAddressCategory = useRef(null)
        const handleSaveContact = async () => {
            const address = ipAddress.current.value;
            const phone_number = ipPhoneNumber.current.value;
            const addressCategory = ipAddressCategory.current.checked ? "Nhà riêng" : "Văn phòng";
            if (address === "" || ipPhoneNumber === "") {
                setAlert("Vui lòng điền đầy đủ thông tin!");
            } else if (!isVietnamesePhoneNumber(phone_number)) {
                setAlert("Số điện thoại không đúng định dạng!");
            } else {
                const result = await saveContact(user?.id, addressCategory, address, phone_number)
                if (result !== false) {
                    setAlert(result)
                }
            }
        }
        return <>
            <div className={cx('contact-form-add')}>
                <div className={cx('title-contact-form')}>
                    <h5>Thêm địa chỉ giao hàng</h5>
                </div>
                <div className={cx('ip-list')}>
                    <input ref={ipAddress} placeholder="Address" />
                    <input ref={ipPhoneNumber} placeholder="Phone number" />
                    <div className={cx('category-contact')}>
                        <div className={cx('option')}>
                            <input ref={ipAddressCategory} value={"Nhà riêng"} type="radio" id="category1" name="category" defaultChecked="true" />
                            <label htmlFor="category1">Nhà riêng</label>
                        </div>
                        <div className={cx('option')}>
                            <input value={"Văn phòng"} type="radio" id="category2" name="category" />
                            <label htmlFor="category2">Văn phòng</label>
                        </div>
                    </div>
                </div>
                <div className={cx('alert-error')}>
                    <span>{alert !== "" && alert}</span>
                </div>
                <div className={cx('btn-add')}>
                    <button onClick={() => handleSaveContact()}>Save</button>
                    <button onClick={() => setShowOption(1)}>Back</button>
                </div>
            </div>
        </>
    }

    const UpdateContact = ({ data }) => {
        const ipAddress = useRef(null)
        const ipPhoneNumber = useRef(null)
        const ipAddressCategory = useRef(null)

        useEffect(() => {
            ipAddress.current.value = data.address
            ipPhoneNumber.current.value = data.phone_number
        }, [data])

        const handleUpdateContact = async () => {
            const address = ipAddress.current.value;
            const phone_number = ipPhoneNumber.current.value;
            const addressCategory = ipAddressCategory.current.checked ? "Nhà riêng" : "Văn phòng";
            if (address === "" || ipPhoneNumber === "") {
                setAlert("Vui lòng điền đầy đủ thông tin!");
            } else if (!isVietnamesePhoneNumber(phone_number)) {
                setAlert("Số điện thoại không đúng định dạng!");
            } else {
                const result = await saveContact(user?.id, addressCategory, address, phone_number)
                if (result !== false) {
                    setAlert(result)
                }
            }
        }
        return <>
            <div className={cx('contact-form-update')}>
                <div className={cx('title-contact-form')}>
                    <h5>Cập nhật địa chỉ giao hàng</h5>
                </div>
                <div className={cx('ip-list')}>
                    <input ref={ipAddress} placeholder="Address" />
                    <input ref={ipPhoneNumber} placeholder="Phone number" />
                    <div className={cx('category-contact')}>
                        <div className={cx('option')}>
                            <input type="radio" id="category1" name="category" defaultChecked="true"/>
                            <label htmlFor="category1">Nhà riêng</label>
                        </div>
                        <div className={cx('option')}>
                            <input type="radio" id="category2" name="category" />
                            <label htmlFor="category2">Văn phòng</label>
                        </div>
                    </div>
                </div>
                <div className={cx('btn-add')}>
                    <button onClick={() => handleUpdateContact()}>Update</button>
                    <button onClick={() => setShowOption(1)}>Back</button>
                </div>
            </div>
        </>
    }
    return (<>
        {showOption === 1 && <Contact />}
        {showOption === 2 && <AddContact />}
        {showOption === 3 && <UpdateContact data={contactUpdate} />}
    </>);
}

export default FormContact;