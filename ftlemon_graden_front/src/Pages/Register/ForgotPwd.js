/* eslint-disable react-hooks/exhaustive-deps */
import AOS from 'aos';
import 'aos/dist/aos.css';
import classNames from "classnames/bind";
import React, { useRef, useState } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import { RiLoaderLine } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import validator from "validator";
import { errorAlert, successAlert, warningAlert } from '../../Components/Alert';
import { getVerificationEmailCode, updatePwd } from '../../Data/user';
import { compareString, encryptString } from '../../Global';
import styles from "./register.module.scss";

function ForgotPwd() {
    const cx = classNames.bind(styles)
    const emailRef = useRef(null)
    const codeMailRef = useRef(null)
    const pwdRef = useRef(null)
    const pwdRefCf = useRef(null)
    const [style, setStyle] = useState({})
    const navigate = useNavigate(null)
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    AOS.init(
        {
            duration: 2000,
            delay: 200
        }
    );

    const setStyleByKey = (key, result) => {
        setStyle((prev) => ({
            ...prev,
            [key]: result ? {} : { borderColor: 'red' }
        }))
    }

    const checkEmail = (e) => {
        const rs = validator.isEmail(e.target.value);
        setStyleByKey('email', rs)
    }
    const checkCodeMail = (e) => {
        const rs = !JSON.parse(localStorage.getItem('resetpwd')) || !compareString(codeMailRef.current.value, JSON.parse(localStorage.getItem('resetpwd')), process.env.REACT_APP_SECRETKEY)
        setStyleByKey('code', rs)
    }
    const checkPwd = (e) => {
        const rs = (e.target.value).length >= 8
        setStyleByKey('pwd', rs)
    }
    const checkPwdCf = (e) => {
        const rs = (e.target.value).length >= 8 && pwdRef.current.value === pwdRefCf.current.value
        setStyleByKey('pwdCf', rs)
    }

    const sendCode = async () => {
        const emailStr = emailRef.current.value
        if (!validator.isEmail(emailStr)) {
            warningAlert("Email invalid!")
            return
        }
        setLoading(true)
        const code = await getVerificationEmailCode(emailStr)
        if (code === "") {
            errorAlert("Email doesn't exist!")
            setLoading(false)
        } else {
            setEmail(emailStr)
            localStorage.setItem('resetpwd', JSON.stringify(encryptString(code, process.env.REACT_APP_SECRETKEY)));
        }
        setLoading(false)
        setStep(2)
    }

    const checkCode = () => {
        setLoading(true)
        if (!JSON.parse(localStorage.getItem('resetpwd')) || !compareString(codeMailRef.current.value, JSON.parse(localStorage.getItem('resetpwd')), process.env.REACT_APP_SECRETKEY)) {
            warningAlert("Email code incorrect!")
            return
        }
        setStep(3)
        setLoading(false)
    }

    const saveNewPwd = async () => {
        if ((pwdRef.current.value).length < 8) {
            warningAlert("Password invalid (>=8)!")
            return;
        }
        if ((pwdRefCf.current.value).length < 8) {
            warningAlert("Password confirm invalid (>=8)!")
            return;
        }
        if (pwdRef.current.value !== pwdRefCf.current.value) {
            warningAlert("Password confirm incorrect!")
            return;
        }
        const resulUpdate = await updatePwd({
            email: email,
            password: pwdRef.current.value
        })
        if (resulUpdate === true) {
            successAlert("Save new password successful")
            setTimeout(() => {
                navigate('/register')
            }, 1000);
        } else {
            errorAlert("Update failed!")
        }
    }

    return (<>
        <div className={cx("forgot_f")}>
            <div className={cx("forgot_form")}>
                <div className={cx('form')}>
                    <div className={cx('content')}>
                        {
                            step === 1 && <div className={cx('email', 'input')}>
                                <input ref={emailRef} onChange={(e) => checkEmail(e)} placeholder="Enter your email" spellCheck='false' style={style.email} onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        sendCode()
                                    }
                                }} />
                                {
                                    !loading && <span className={cx('icon_send')}><AiOutlineArrowRight style={{ fontSize: '25px' }} onClick={() => {
                                        sendCode()
                                    }} /></span>
                                }
                                {
                                    loading && <span className={cx('icon_load')}><RiLoaderLine style={{ fontSize: '35px', color: 'black' }} /></span>
                                }
                            </div>
                        }

                        {
                            step === 2 && <>
                                <div className={cx('email', 'input')}>
                                    <input ref={codeMailRef} onChange={() => {checkCodeMail()}} placeholder="Enter verificode code" spellCheck='false'  onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            checkCode()
                                        }
                                    }} />
                                    {
                                        !loading && <span className={cx('icon_send')}><AiOutlineArrowRight style={{ fontSize: '25px' }} onClick={() => {
                                            checkCode()
                                        }} /></span>
                                    }
                                    {
                                        loading && <span className={cx('icon_load')}><RiLoaderLine style={{ fontSize: '35px', color: 'black' }} /></span>
                                    }
                                </div>
                            </>
                        }

                        {
                            step === 3 && <>
                                <div className={cx('password', 'input')}>
                                    <input ref={pwdRef} onChange={(e) => checkPwd(e)} type="password" data-aos="zoom-out-left" placeholder="Enter password" spellCheck='false' style={style.pwd} />
                                </div>
                                <div className={cx('password_confirm', 'input')} onKeyDown={(e) => {
                                    if(e.key === "Enter"){
                                        saveNewPwd()
                                    }
                                }}>
                                    <input ref={pwdRefCf} onChange={(e) => checkPwdCf(e)} type="password" data-aos="zoom-out-right" placeholder="Enter password again" spellCheck='false' style={style.pwdCf} />
                                </div>
                            </>
                        }
                    </div>
                    <div className={cx('btn_group')}>
                        {
                            step === 3 && <button onClick={() => saveNewPwd()}>Save</button>
                        }
                        {step === 2 && <>
                            <button>Send code again</button>
                            <button>Confirm</button>
                        </>}
                        <button onClick={() => { navigate('/register') }}>Sign in, now</button>
                    </div>
                </div>
            </div>
        </div>
    </>);
}

export default ForgotPwd;