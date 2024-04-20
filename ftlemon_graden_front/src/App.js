/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import Cart from "./Pages/Cart"
import Contact from "./Pages/Contact"
import ErrorPage from "./Pages/Error"
import Home from "./Pages/Home"
import Management from "./Pages/Management"
import DashBoard from "./Pages/Management/DashBoard"
import MessAdmin from "./Pages/Management/Message"
import Product from "./Pages/Management/Product"
import AddProduct from "./Pages/Management/Product/AddProduct"
import ExportProduct from "./Pages/Management/Product/ExportProduct"
import ImportProduct from "./Pages/Management/Product/ImportProduct"
import UpdateProduct from "./Pages/Management/Product/UpdateProduct"
import Message from "./Pages/Message"
import ProductDetails from "./Pages/ProductDetails"
import Register from "./Pages/Register"
import Shop from "./Pages/Shop"
import { DataContext } from "./Provider/DataProvider"

function App() {

  const { user } = useContext(DataContext)
  const [routes, setRoutes] = useState()

  const authRoutes = () => {
    if ((user?.role)?.toString() === process.env.REACT_APP_ADMIN_ROLE) {
      return [
        { path: '/admin/chat', element: <Management><MessAdmin /></Management> },
        { path: '/admin', element: <Management><DashBoard /></Management> },
        { path: '/admin/product', element: <Management><Product><UpdateProduct /></Product></Management> },
        { path: '/admin/product-import', element: <Management><Product><ImportProduct /></Product></Management> },
        { path: '/admin/product-export', element: <Management><Product><ExportProduct /></Product></Management> },
        { path: '/admin/product-add', element: <Management><Product><AddProduct /></Product></Management> },
        { path: '/', element: <Home /> },
        { path: '/products', element: <Shop /> },
        { path: '/cart', element: <Cart /> },
        { path: '/register', element: <Register /> },
        { path: '/contacts', element: <Contact /> },
        { path: '/productdetails', element: <ProductDetails /> },
        { path: '/chat', element: <Message /> },
        { path: "*", element: <Navigate to="/" /> }
      ]
    } else if ((user?.role)?.toString() === process.env.REACT_APP_CUSTOMER_ROLE) {
      return [
        { path: '/', element: <Home /> },
        { path: '/products', element: <Shop /> },
        { path: '/cart', element: <Cart /> },
        { path: '/register', element: <Register /> },
        { path: '/contacts', element: <Contact /> },
        { path: '/page-not-found', element: <ErrorPage /> },
        { path: '/chat', element: <Message /> },
        { path: '/productdetails', element: <ProductDetails /> },
        { path: "*", element: <Navigate to="/page-not-found" /> },
      ]
    } else {
      return [
        { path: '/', element: <Home /> },
        { path: '/products', element: <Shop /> },
        { path: '/cart', element: <Cart /> },
        { path: '/register', element: <Register /> },
        { path: '/contacts', element: <Contact /> },
        { path: '/page-not-found', element: <ErrorPage /> },
        { path: '/chat', element: <Message /> },
        { path: '/productdetails', element: <ProductDetails /> },
        { path: "*", element: <Navigate to="/page-not-found" /> },
        { path: '/abc', element: <ProductDetails /> },
      ]
    }
  }

  useEffect(() => {
    const matchRoutes = authRoutes()?.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ));
    setRoutes(matchRoutes)
  }, [user])

  return (
    <Routes>
      {routes}
    </Routes>
  );
}

export default App;
