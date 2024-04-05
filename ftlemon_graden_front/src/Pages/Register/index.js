/* eslint-disable react-hooks/exhaustive-deps */
import AOS from 'aos';
import 'aos/dist/aos.css';
import className from "classnames/bind";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import validator from 'validator';
import Alert from '../../Components/Alert';
import Loading from '../../Components/Loading';
import { register, signIn } from '../../Data/user';
import { DataContext } from '../../Provider/DataProvider';
import { EffectContext } from '../../Provider/EffectProvider';
import styles from "./register.module.scss";

function Register() {
    const cx = className.bind(styles)
    const styleIcon = { fontSize: "25px" };
    const [formRegister, setFormRegister] = useState(false)
    const emailRef = useRef(null)
    const usernameRef = useRef(null)
    const pwdRef = useRef(null)
    const pwdRefCf = useRef(null)
    const [show, setShow] = useState(false)
    const [alert, setAlert] = useState({})
    const [style, setStyle] = useState({})
    const navigate = useNavigate();
    const {user, updateCookie, urlHistory, updateUrlHistory} = useContext(DataContext)
    const {focusLink} = useContext(EffectContext)
    const [showLoading, setShowLoading] = useState(false)
    AOS.init(
        {
            duration: 2000,
            delay: 200
        }
    );
    useEffect(() => {
        navigation(user)
    }, [user])
    
    const navigation = (user) => {
        if(urlHistory && user){
            const url = urlHistory;
            updateUrlHistory(null)
            window.location.href = `${url}`
        }
        if(user){
            if(focusLink === 1){ navigate('/')}
            if(focusLink === 2){ navigate('/products')}
            if(focusLink === 3){ navigate('/contacts')}
            if(focusLink === 4){ navigate('/cart')}
        }
    }
    const setStyleByKey = (key, result) => {
        setStyle((prev) => ({
            ...prev,
            [key]: result ? {} : { borderBottomColor: 'red' }
        }))
    }
    const checkEmail = (e) => {
        const rs = validator.isEmail(e.target.value);
        setStyleByKey('email', rs)
    }
    const checkUsername = (e) => {
        const rs = (e.target.value).length >= 6
        setStyleByKey('username', rs)
    }
    const checkPwd = (e) => {
        const rs = (e.target.value).length >= 8
        setStyleByKey('pwd', rs)
    }
    const checkPwdCf = (e) => {
        const rs = (e.target.value).length >= 8 && pwdRef.current.value === pwdRefCf.current.value
        setStyleByKey('pwdCf', rs)
    }
    const showErrorAlert = (content) => {
        setAlert({
            title: "error",
            type: 'error',
            content: content
        })
        setShow(show === false ? true : true)
    }
    const showSuccessAlert = (content) => {
        setAlert({
            title: "success",
            type: 'success',
            content: content
        })
        setShow(show === false ? true : true)
    }
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (show) setShow(false)
        }, 2000)
        return () => clearTimeout(timeout)
    }, [show])

    const setShowCallBack = () => {
        setShow(false)
    }

    useEffect(() => {
        if (emailRef.current) {
            emailRef.current.value = ""
        }
        usernameRef.current.value = ""
        pwdRef.current.value = ""
        if (pwdRefCf.current) {
            pwdRefCf.current.value = ""
        }
        setStyle({})
    }, [formRegister])

    const submitRegister = async () => {
        if (emailRef.current.value === '' || usernameRef.current.value === ''
            || pwdRef.current.value === '' || pwdRefCf.current.value === '') {
            showErrorAlert("Please, check information!")
            return;
        }
        if (!validator.isEmail(emailRef.current.value)) {
            showErrorAlert("Email invalid!")
            return;
        }
        if ((usernameRef.current.value).length < 6) {
            showErrorAlert("Username invalid (>=6)!")
            return;
        }
        if ((pwdRef.current.value).length < 8) {
            showErrorAlert("Password invalid (>=8)!")
            return;
        }
        if ((pwdRefCf.current.value).length < 8) {
            showErrorAlert("Password confirm invalid (>=8)!")
            return;
        }
        if (pwdRef.current.value !== pwdRefCf.current.value) {
            showErrorAlert("Password confirm incorrect!")
            return;
        }
        const resultInsert = await register({
            email: emailRef.current.value,
            username: usernameRef.current.value,
            pwd: pwdRef.current.value
        })
        if (resultInsert === "Insert successfully") {
            showSuccessAlert("Register successfully")
        } else {
            showErrorAlert(resultInsert + "!")
        }
    }

    const submitSignIn = async () => {
        if (usernameRef.current.value === '' || pwdRef.current.value === '') {
            showErrorAlert("Please, check information!")
            return;
        }
        if ((usernameRef.current.value).length < 6) {
            showErrorAlert("Username invalid (>=6)!")
            return;
        }
        if ((pwdRef.current.value).length < 8) {
            showErrorAlert("Password invalid (>=8)!")
            return;
        }
        const resultSignIn = await signIn({
            username: usernameRef.current.value,
            pwd: pwdRef.current.value
        })
        if (resultSignIn === null) {
            showErrorAlert('Please check username or password again!')
        } else {
            const expirationDate = new Date();
            const newExpirationDate = new Date(expirationDate.getTime());
            newExpirationDate.setMinutes(newExpirationDate.getMinutes() + 30);
            setShowLoading(true)
            updateCookie({ key: 'tokens', value:  btoa(JSON.stringify(resultSignIn)), expires: newExpirationDate });
            const timeout = setTimeout(() => {
                setShowLoading(false)
            }, 1000);
            return () => clearInterval(timeout)
        }
    }
    return (<>
        {
            showLoading && <Loading />
        }
        {
            show && <Alert content={alert.content} title={alert.title} type={alert.type} setShow={setShowCallBack} />
        }
        <div className={cx("register_signin")}>
            <div className={cx("register_form")}>
                <div className={cx('form')}>
                    <div className={cx('title')}>
                        {formRegister && <span data-aos='fade-right'>REGISTER</span>}
                        {!formRegister && <span data-aos='fade-left'>SIGN IN</span>}
                    </div>
                    <div className={cx('content')}>
                        {formRegister && <div className={cx('email', 'input')}>
                            <input ref={emailRef} onChange={(e) => checkEmail(e)} data-aos="zoom-out-left" placeholder="Enter email" spellCheck='false' style={style.email} />
                        </div>}
                        <div className={cx('username', 'input')}>
                            <input ref={usernameRef} onChange={(e) => checkUsername(e)} data-aos="zoom-out-right" placeholder="Enter username" spellCheck='false' style={style.username} />
                        </div>
                        <div className={cx('password', 'input')}>
                            <input ref={pwdRef} onChange={(e) => checkPwd(e)} type="password" data-aos="zoom-out-left" placeholder="Enter password" spellCheck='false' style={style.pwd} />
                        </div>
                        {formRegister && <div className={cx('password_confirm', 'input')}>
                            <input ref={pwdRefCf} onChange={(e) => checkPwdCf(e)} type="password" data-aos="zoom-out-right" placeholder="Enter password" spellCheck='false' style={style.pwdCf} />
                        </div>}
                        {!formRegister && <div className={cx('forgot')}>
                            <span data-aos='zoom-in'>Forgot password? Never mind, click me!</span>
                        </div>}
                    </div>
                    <div className={cx('btn_group')}>
                        {
                            formRegister ? <button  onClick={() => submitRegister()}>Register</button> :
                                <button  onClick={() => submitSignIn()}>Sign in</button>
                        }
                        <button ><FcGoogle style={styleIcon} /></button>
                        <button onClick={() => {
                            setFormRegister((!formRegister))
                        }}>{formRegister ? "Sign in, now" : "Register"}</button>
                    </div>
                </div>
            </div>
        </div>
    </>);
}

export default Register;