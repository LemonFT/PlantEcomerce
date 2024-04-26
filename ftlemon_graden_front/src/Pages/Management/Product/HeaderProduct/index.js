import classNames from "classnames/bind";
import React, { useContext, useEffect, useRef, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdPostAdd } from "react-icons/md";
import { TbTableExport } from "react-icons/tb";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllProduct } from "../../../../Data/product";
import { EffectContext } from "../../../../Provider/EffectProvider";
import styles from "../index.module.scss";

function HeaderProduct({returnKeySearch}) {
    const cx = classNames.bind(styles)
    const inputSearch = useRef(null)
    const styleIcon = { fontSize: '25px' }
    const { focusLinkProduct, updateFocusLinkProduct } = useContext(EffectContext)
    const navigate = useNavigate()
    const location = useLocation();
    const currentPath = location.pathname;
    const [product, setProduct] = useState([])
    
    const fetchData = async () => {
        const data = await getAllProduct();
        if (data) {
            setProduct(data)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const search = () => {
        returnKeySearch(inputSearch.current.value)
    }

    useEffect(() => {
        switch (currentPath) {
            case "/admin/product-add":
                updateFocusLinkProduct(1)
                break;
            case "/admin/product-import":
                updateFocusLinkProduct(2)
                break;
            case "/admin/product-export":
                updateFocusLinkProduct(3)
                break;
            default:
                updateFocusLinkProduct(0)
                break;
        }
    }, [currentPath, updateFocusLinkProduct])


    const styleFocus = { backgroundColor: 'rgb(76, 120, 222)'}

    return (<>
        <div className={cx('header')}>
            <div className={cx('title')} onClick={() => navigate("/admin/product")}>
                <h4>List of products</h4>
                <span style={{transition: 'all 2s'}}>{product.length} available products</span>
            </div>
            <div className={cx('btns')}>
                <div className={cx('search')}>
                    <input readOnly={focusLinkProduct !== 0} style={focusLinkProduct === 0 ? {} : {opacity: '0'}} ref={inputSearch} placeholder="Search..." onChange={() => search()} />
                </div>
                <div className={cx('button')} style={focusLinkProduct === 1 ? {...styleFocus} : {}}
                    onClick={() => navigate("/admin/product-add")}
                >
                    <span><IoIosAddCircleOutline style={styleIcon} /></span>
                    <button>
                        Add new product
                    </button>
                </div>
                <div className={cx('button')} style={focusLinkProduct === 2 ? {...styleFocus} : {}}
                    onClick={() => navigate("/admin/product-import")}
                >
                    <span><MdPostAdd style={styleIcon} /></span>
                    <button>
                        Import product
                    </button>
                </div>
                <div className={cx('button')} style={focusLinkProduct === 3 ? {...styleFocus} : {}}
                    onClick={() => navigate("/admin/product-export")}
                >
                    <span><TbTableExport style={styleIcon} /></span>
                    <button>
                        Export product
                    </button>
                </div>
            </div>
        </div>
    </>);
}

export default HeaderProduct;