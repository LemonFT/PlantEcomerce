/* eslint-disable react-hooks/exhaustive-deps */
import classNames from "classnames/bind";
import { useEffect, useRef, useState } from "react";
import { BsImages } from "react-icons/bs";
import { IoCloseCircle } from "react-icons/io5";
import Alert from "../../../Components/Alert";
import { deleteImage, getInfoDetails, insertImage, updateImageProduct } from "../../../Data/product";
import { handleImageUpload } from "../../../FirebaseConfig";
import styles from "./index.module.scss";
const BoxImages = ({ id, funcCallBack }) => {
    const cx = classNames.bind(styles)
    const styleIcon = { fontSize: '25px' }

    const refFile = useRef()
    const [images, setImages] = useState([])
    const [imageUpload, setImageUpload] = useState()
    const [imageMain, setImageMain] = useState()
    const [showAlert, setShowAlert] = useState(false)

    const fetchData = async () => {
        const dt = await getInfoDetails(id)
        if (dt != null) {
            setImageMain(dt?.product.image)
            const list = dt?.productImages.map(item => item?.image);
            setImages(list)
        }
    }
    useEffect(() => {
        fetchData()
    }, [id])



    const upload = async (e) => {
        const resultUpload = await handleImageUpload(e)
        if (resultUpload !== 'error') {
            setImageUpload(resultUpload)
        }
    }

    const handleDeleteImage = async (product_id, image) => {
        const resultDelete = await deleteImage(product_id, image)
        if (resultDelete) {
            fetchData()
        }
    }

    const handleInsertImage = async (product_id, image) => {
        if (!imageUpload) {
            setShowAlert(true)
            setTimeout(() => {
                setShowAlert(false)
            }, 1500)
            return;
        }
        const resultInert = await insertImage(product_id, image)
        if (resultInert) {
            fetchData()
        }
    }
    const handleUpdateImage = async (product_id, image) => {
        if (!imageUpload) {
            setShowAlert(true)
            setTimeout(() => {
                setShowAlert(false)
            }, 1500)
            return
        }
        const resultUpdate = await updateImageProduct(product_id, image)
        if (resultUpdate) {
            fetchData()
        }
    }


    return <>
        {
            showAlert && <Alert content={"Please, upload image!"} setShow={() => { setShowAlert(false) }} type={"warning"} title={"warning"} centerVertical={true} />
        }
        <div className={cx('parent-scroll')}>
            <div className={cx('upload-form')}>
                <div className={cx('close')}>
                    <IoCloseCircle style={styleIcon} onClick={() => {
                        setImages()
                        funcCallBack()
                    }} />
                </div>
                <div className={cx('box-upload-image')}>
                    <div className={cx('title')}><h3>Upload Photo</h3></div>
                    <div className={cx('container-box-image')}>
                        <div className={cx('box-image')} onClick={() => {
                            document.getElementById("file-image").click()
                        }} >
                            <div className={cx('icon-image')}>
                                <BsImages style={{ fontSize: '100px', color: 'black' }} />
                            </div>
                            <div className={cx('used')}>
                                <h5>Click here to upload photo</h5>
                            </div>
                            <div className={cx('support-img')}>
                                <span>Supports: PNG, JPG, JPEG, WEBP</span>
                            </div>
                            <input id="file-image" ref={refFile} type="file" style={{ display: 'none' }} onChange={(e) => upload(e)} />
                        </div>
                        <div className={cx('image-demo')}>
                            <img src={imageUpload || ""} alt="" />
                        </div>
                    </div>
                </div>
                <div className={cx('group-btn')}>
                    <button onClick={() => {
                        handleInsertImage(id, imageUpload)
                    }}>Add sub image</button>
                    <button onClick={() => {
                        handleUpdateImage(id, imageUpload)
                    }}>Update main image</button>
                </div>
                <div className={cx('line')}>
                    <span></span>
                    <h5>Photos now</h5>
                </div>
                <div className={cx('seen-image')}>
                    <div className={cx('main-image')}>
                        <div className={cx('note')}>
                            <h4>Main photo</h4>
                        </div>
                        <img src={imageMain || images[0] || ""} alt="" />
                    </div>
                    <div className={cx('sub-images')}>
                        <div className={cx('note')}>
                            <h4>Sub photo photo</h4>
                        </div>

                        <div className={cx('images')}>
                            {
                                images.map((item, index) => (
                                    <div key={index} className={cx('s-box-image')}>
                                        <img src={item} alt="" />
                                        <span onClick={() => handleDeleteImage(id, item)}>Delete</span>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default BoxImages;