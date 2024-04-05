import classNames from "classnames/bind";
import { useContext, useEffect, useRef, useState } from "react";
import { CiTrash } from "react-icons/ci";
import { GiSaveArrow } from "react-icons/gi";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { MdPostAdd } from "react-icons/md";
import { TbTableExport } from "react-icons/tb";
import Alert from "../../../Components/Alert";
import Combobox from "../../../Components/Selected";
import { getAllProduct, updateProduct } from "../../../Data/product";
import { handleImageUpload } from "../../../FirebaseConfig";
import uploadDefault from "../../../Images/File.png";
import { DataContext } from "../../../Provider/DataProvider";
import BoxImages from "../BoxImages";
import styles from "./index.module.scss";

function Product() {
    const cx = classNames.bind(styles)
    const styleIcon = { fontSize: '25px' }
    const ipSearch = useRef(null)
    const [page, setPage] = useState(1)
    const [product, setProduct] = useState([])
    const [productRender, setProductRender] = useState([])
    const { productCategory } = useContext(DataContext)
    const [seeMore, setSeeMore] = useState()
    const [categoryForm, setCategoryForm] = useState(-1)
    const [imageUpload, setImageUpload] = useState("")
    const [showAlert, setShowAlert] = useState({
        display: false,
        context: "",
        type: "",
        title: ""
    })

    const showSuccess = (context) => {
        setShowAlert({
            display: true,
            context: context,
            type: "info",
            title: "Notification"
        })
        const timeout = setTimeout(() => {
            setShowAlert({
                display: false
            })
        }, 1500);
        return () => clearTimeout(timeout)
    }

    const showError = (context) => {
        setShowAlert({
            display: true,
            context: context,
            type: "error",
            title: "error"
        })
        const timeout = setTimeout(() => {
            setShowAlert({
                display: false
            })
        }, 1500);
        return () => clearTimeout(timeout)
    }

    const fetchData = async () => {
        const data = await getAllProduct();
        if (data) {
            setProduct(data)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        setProductRender(product)
    }, [product])

    const handleSearch = () => {
        const searchKey = ipSearch.current.value
        const searchFilter = product.filter(item => {
            const id = item.id.toString().toLowerCase()
            const code = item.code.toString().toLowerCase()
            const name = item.name.toString().toLowerCase()
            const categoryName = getCategoryName(item.category_product_id).toString().toLowerCase()
            const price = item.price.toString().toLowerCase()
            const amount = item.amount.toString().toLowerCase()
            const voucher = item.voucher.toString().toLowerCase()

            return (
                id.includes(searchKey) ||
                code.includes(searchKey) ||
                name.includes(searchKey) ||
                categoryName.includes(searchKey) ||
                price.includes(searchKey) ||
                amount.includes(searchKey) ||
                voucher.includes(searchKey)
            );
        }
        );
        setProductRender(searchFilter)
    }

    const getCategoryName = (category_product_id) => {
        return productCategory.find(item => item.id === category_product_id)?.name;
    }

    const funcCallBack = (product_id, category_id) => {
        if (category_id) {
            setProduct((prev) => (
                prev.map((item) => {
                    if (item.id === product_id) {
                        return {
                            ...item,
                            category_product_id: category_id
                        };
                    }
                    return item;
                })
            ));
        }
        setCategoryForm(-1)
    }

    const ShowCategoryForm = ({ id, funcCallBack }) => {
        return <>
            <div className={cx('category-form')}>
                <div className={cx('title-category')}>
                    Danh sách các loại cây
                    <IoClose style={styleIcon} onClick={() => { funcCallBack() }} />
                </div>
                <div className={cx('categorys')}>
                    {
                        productCategory?.map((category, index) => (
                            <div key={index} className={cx('category')} onClick={() => {
                                funcCallBack(id, category?.id)
                            }}>
                                <span>{getCategoryName(category.id)}</span>
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    }

    const Row = ({ item }) => {
        const name = useRef(null)
        const desc = useRef(null)
        const price = useRef(null)
        const amount = useRef(null)
        const voucher = useRef(null)
        const display = useRef(null)


        const handleUpdateProduct = async () => {
            const resultUpdate = await updateProduct({
                id: item?.id,
                name: name.current.value,
                category: item.category_product_id,
                desc: desc.current.value,
                price: price.current.value,
                amount: amount.current.value,
                voucher: voucher.current.value,
                display: display.current.value === "on"
            })
            if (resultUpdate) {
                fetchData()
                showSuccess("Update successfully!")
            } else {
                showError("Update false")
            }
        }

        return <>
            <tr>
                <td>{item?.id}</td>
                <td>{item?.code}</td>
                <td>
                    <input ref={name} defaultValue={item?.name} />
                </td>
                <td>
                    <textarea ref={desc} defaultValue={item?.description} />
                </td>
                <td>
                    <div className={cx('categoty-name')} onClick={() => {
                        setCategoryForm(item?.id)
                    }}>
                        {getCategoryName(item?.category_product_id)}
                    </div>
                </td>
                <td>
                    <img src={item?.image || "https://th.bing.com/th/id/OIP.ySVmggfv9t54Jmq57-j-9wHaE8?rs=1&pid=ImgDetMain"} alt="" />
                    <button onClick={() => {
                        setSeeMore(item?.id)
                    }}>See more images</button>
                </td>
                <td><input ref={price} defaultValue={item?.price} /></td>
                <td><input ref={amount} defaultValue={item?.amount} /></td>
                <td><input ref={voucher} defaultValue={item?.voucher} /></td>
                <td>
                    <input ref={display} type="checkbox" defaultChecked={item?.display} />
                </td>
                <td>
                    <GiSaveArrow style={styleIcon} onClick={() => handleUpdateProduct()} />
                </td>
                <td>
                    <CiTrash style={styleIcon} />
                </td>
            </tr>
        </>
    }

    const convertOptionCategory = () => {
        return productCategory?.map(item => ({
            value: item?.id,
            label: item?.name
        }))
    }

    const upload = async (e) => {
        const resultUpload = await handleImageUpload(e)
        if (resultUpload !== 'error') {
            setImageUpload(resultUpload)
        }
    }

    return (<>
        {showAlert.display && <Alert
            content={showAlert.context}
            centerVertical={true}
            type={showAlert.type}
            title={showAlert.title}
            setShow={() => setShowAlert(false)} />}
        {page === 1 &&
            (seeMore ? <BoxImages id={seeMore} funcCallBack={() => { setSeeMore() }} /> :
                <div className={cx('product')}>
                    <div className={cx('header')}>
                        <div className={cx('title')} onClick={() => setPage(1)}>
                            <h4>List of products</h4>
                            <span>320 available products</span>
                        </div>
                        <div className={cx('btns')}>
                            <div className={cx('search')}>
                                <input ref={ipSearch} placeholder="Search..." onChange={() => handleSearch()} />
                            </div>
                            <div className={cx('button')} onClick={() => {
                                setPage(2)
                            }}>
                                <span><IoIosAddCircleOutline style={styleIcon} /></span>
                                <button>
                                    Add new product
                                </button>
                            </div>
                            <div className={cx('button')} onClick={() => {
                                setPage(3)
                            }}>
                                <span><MdPostAdd style={styleIcon} /></span>
                                <button>
                                    Import product
                                </button>
                            </div>
                            <div className={cx('button')} onClick={() => {
                                setPage(4)
                            }}>
                                <span><TbTableExport style={styleIcon} /></span>
                                <button>
                                    Export product
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={cx('table')}>
                        {categoryForm !== -1 && <ShowCategoryForm id={categoryForm} funcCallBack={funcCallBack} />}
                        <table>
                            <thead>
                                <tr>
                                    <td>id</td>
                                    <td>code</td>
                                    <td>name</td>
                                    <td>description</td>
                                    <td>category</td>
                                    <td>image</td>
                                    <td>price</td>
                                    <td>amount</td>
                                    <td>voucher (%)</td>
                                    <td>display</td>
                                    <td>update</td>
                                    <td>delete</td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    (productRender)?.map((item, index) => (
                                        <Row key={index} item={item} />
                                    ))
                                }
                                {
                                    productRender.length === 0 && (
                                        <tr className={cx('no-data')}>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>Không có</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            )
        }
        {
            page === 2 && (
                <div className={cx('insert-product')}>
                    <div className={cx('header')}>
                        <div className={cx('title')} onClick={() => setPage(1)}>
                            <h4>List of products</h4>
                            <span>320 available products</span>
                        </div>
                        <div className={cx('btns')}>
                            <div className={cx('search')}>
                                <input ref={ipSearch} placeholder="Search..." onChange={() => handleSearch()} />
                            </div>
                            <div className={cx('button')} onClick={() => {
                                setPage(2)
                            }}>
                                <span><IoIosAddCircleOutline style={styleIcon} /></span>
                                <button>
                                    Add new product
                                </button>
                            </div>
                            <div className={cx('button')} onClick={() => {
                                setPage(3)
                            }}>
                                <span><MdPostAdd style={styleIcon} /></span>
                                <button>
                                    Import product
                                </button>
                            </div>
                            <div className={cx('button')} onClick={() => {
                                setPage(4)
                            }}>
                                <span><TbTableExport style={styleIcon} /></span>
                                <button>
                                    Export product
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={cx('container')}>
                        <div className={cx('form-insert')}>
                            <span className={cx('line-top')}>Thêm sản phẩm</span>
                            <div className={cx('ips')}>
                                <div className={cx('left')}>
                                    <div className={cx('ip-name')}>
                                        <input placeholder="Enter name product ..." />
                                    </div>
                                    <div className={cx('ip-desc')}>
                                        <textarea placeholder="Enter description product ..." />
                                    </div>
                                    <div className={cx('price')}>
                                        <input placeholder="Enter price product" />
                                    </div>
                                    <div className={cx('voucher')}>
                                        <input placeholder="Enter voucher product" />
                                    </div>
                                </div>
                                <div className={cx('right')}>
                                    <div className={cx('category')}>
                                        <Combobox options={convertOptionCategory()} isMulti={true} closeMenuOnSelect={false} width={200} returnValue={() => { }} />
                                    </div>
                                    <div className={cx('image')}>
                                        <input type="file" id="ip-file" style={{ display: 'none' }}
                                            onChange={(e) => upload(e)}
                                        />
                                        <img
                                            onClick={() => {
                                                document.getElementById('ip-file').click()
                                            }}
                                            src={imageUpload !== "" ? imageUpload : uploadDefault} alt=""
                                            />
                                    </div>
                                </div>
                            </div>
                            <div className={cx('btn-insert')}>
                                <button>Lưu sản phẩm</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        {
            page === 3 && (
                <div className={cx('import-product')}>
                    <div className={cx('header')}>
                        <div className={cx('title')} onClick={() => setPage(1)}>
                            <h4>List of products</h4>
                            <span>320 available products</span>
                        </div>
                        <div className={cx('btns')}>
                            <div className={cx('search')}>
                                <input ref={ipSearch} placeholder="Search..." onChange={() => handleSearch()} />
                            </div>
                            <div className={cx('button')} onClick={() => {
                                setPage(2)
                            }}>
                                <span><IoIosAddCircleOutline style={styleIcon} /></span>
                                <button>
                                    Add new product
                                </button>
                            </div>
                            <div className={cx('button')} onClick={() => {
                                setPage(3)
                            }}>
                                <span><MdPostAdd style={styleIcon} /></span>
                                <button>
                                    Import product
                                </button>
                            </div>
                            <div className={cx('button')} onClick={() => {
                                setPage(4)
                            }}>
                                <span><TbTableExport style={styleIcon} /></span>
                                <button>
                                    Export product
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={cx('container')}>
                        import
                    </div>
                </div>
            )
        }
        {
            page === 4 && (
                <div className={cx('export-product')}>
                    <div className={cx('header')}>
                        <div className={cx('title')} onClick={() => setPage(1)}>
                            <h4>List of products</h4>
                            <span>320 available products</span>
                        </div>
                        <div className={cx('btns')}>
                            <div className={cx('search')}>
                                <input ref={ipSearch} placeholder="Search..." onChange={() => handleSearch()} />
                            </div>
                            <div className={cx('button')} onClick={() => {
                                setPage(2)
                            }}>
                                <span><IoIosAddCircleOutline style={styleIcon} /></span>
                                <button>
                                    Add new product
                                </button>
                            </div>
                            <div className={cx('button')} onClick={() => {
                                setPage(3)
                            }}>
                                <span><MdPostAdd style={styleIcon} /></span>
                                <button>
                                    Import product
                                </button>
                            </div>
                            <div className={cx('button')} onClick={() => {
                                setPage(4)
                            }}>
                                <span><TbTableExport style={styleIcon} /></span>
                                <button>
                                    Export product
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={cx('container')}>
                        export
                    </div>
                </div>
            )
        }
    </>);
}

export default Product;