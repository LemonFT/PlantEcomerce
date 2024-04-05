import classNames from "classnames/bind";
import Header from "../../Components/Header";
import qr from "../../Images/qr.jpg";
import styles from "./index.module.scss";
function Contact() {
    const cx = classNames.bind(styles)
    return ( <>
        <Header />
        <div className={cx('contact')}>
            <h1>Liên hệ với chúng tôi</h1>
            <div className={cx('container')}>
                <div className={cx('location')}>
                    <div><h4>Địa chỉ:</h4> 226/14 Tân Hòa Đông, Bình Trị Đông, Bình Tân</div>
                    <div><h4>Hotline:</h4> 0826 081003 - 0941 545482</div>
                    <div><h4>Email:</h4> lemonftdev@gmail.com</div>
                    <div><h4>Mở cửa:</h4> 7:30 - 5:30</div>
                </div>
                <div className={cx('mess')}>
                    <input placeholder="Tên của bạn..." />
                    <input placeholder="Email liên hệ..." />
                    <input placeholder="Tin nhắn..." />
                    <button>Gửi đi</button>
                </div>
                <div className={cx('qr')}>
                    <img src={qr} alt="" />
                </div>
            </div>
        </div>
    </> );
}

export default Contact;