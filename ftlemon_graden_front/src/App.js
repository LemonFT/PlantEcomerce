/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import Cart from "./Pages/Cart"
import Contact from "./Pages/Contact"
import Home from "./Pages/Home"
import Management from "./Pages/Management"
import Account from "./Pages/Management/Account"
import DashBoard from "./Pages/Management/DashBoard"
import MessAdmin from "./Pages/Management/Message"
import Order from "./Pages/Management/Order"
import Product from "./Pages/Management/Product"
import AddProduct from "./Pages/Management/Product/AddProduct"
import ExportProduct from "./Pages/Management/Product/ExportProduct"
import ImportProduct from "./Pages/Management/Product/ImportProduct"
import UpdateProduct from "./Pages/Management/Product/UpdateProduct"
import WelcomePage from "./Pages/Management/WelcomePage"
import Message from "./Pages/Message"
import ProductDetails from "./Pages/ProductDetails"
import Register from "./Pages/Register"
import Shop from "./Pages/Shop"
import { DataContext } from "./Provider/DataProvider"

function App() {

  const { user } = useContext(DataContext)
  const [routes, setRoutes] = useState()

  const PermissionByUser = () => {
    let permissionAuth = [];
    user?.permissions.forEach(permission => {
      if (permission?.name === "VIEW_STATISTICS") {
        permissionAuth.push(
          { path: '/admin/dashboard', element: <Management><DashBoard /></Management> }
        );
      }
      if (permission?.name === "ORDER") {
        permissionAuth.push(
          { path: '/admin/order', element: <Management><Order /></Management> }
        );
      }
      if (permission?.name === "ACCOUNT_MANAGEMENT") {
        permissionAuth.push(
          { path: '/admin/account', element: <Management><Account /></Management> }
        );
      }
      if (permission?.name === "CUSTOMER_CONSULTING") {
        permissionAuth.push(
          { path: '/admin/chat', element: <Management><MessAdmin /></Management> }
        );
      }
      if (permission?.name === "PRODUCT") {
        permissionAuth.push(
          { path: '/admin/product', element: <Management><Product><UpdateProduct /></Product></Management> },
          { path: '/admin/product-import', element: <Management><Product><ImportProduct /></Product></Management> },
          { path: '/admin/product-export', element: <Management><Product><ExportProduct /></Product></Management> },
          { path: '/admin/product-add', element: <Management><Product><AddProduct /></Product></Management> }
        );
      }
      if(permissionAuth.length > 0){
        permissionAuth.push(
          { path: '/admin', element: <Management><WelcomePage /></Management> }
        );
      }
    });
    return permissionAuth;
  }
  
  const authRoutes = () => {
    let routes = [];
    if ((user?.role)?.toString() !== process.env.REACT_APP_CUSTOMER_ROLE) {
      routes = PermissionByUser();
    }
    routes.push(
      { path: '/', element: <Home /> },
      { path: '/products', element: <Shop /> },
      { path: '/cart', element: <Cart /> },
      { path: '/register', element: <Register /> },
      { path: '/contacts', element: <Contact /> },
      { path: '/productdetails', element: <ProductDetails /> },
      { path: '/chat', element: <Message /> },
      { path: "*", element: <Navigate to="/" /> }
    );
    return routes;
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
