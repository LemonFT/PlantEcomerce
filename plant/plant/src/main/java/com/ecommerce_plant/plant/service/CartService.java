package com.ecommerce_plant.plant.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce_plant.plant.model.Cart;
import com.ecommerce_plant.plant.repository.CartRep;

@Service
public class CartService {
    @Autowired
    CartRep cartRep;

    public List<Cart> getProductsInCartUser(int user_id) {
        return cartRep.findAllCartsByUserId(user_id);
    }

    public boolean insertCart(Cart cart) {
        boolean result = false;
        Cart exist = cartRep.checkExistProduct(cart.getUser_id(), cart.getProduct_id());
        if (exist != null) {
            int number = exist.getNumber() + cart.getNumber();
            cart.setNumber(number);
            result = cartRep.updateCart(cart);
        } else {
            result = cartRep.insertCart(cart);
        }
        return result;
    }

    public boolean deleteProductInCart(int user_id, int product_id) {
        return cartRep.deleteCart(user_id, product_id);
    }

    public boolean deleteAllProductInCart(int user_id) {
        return cartRep.deleteAllCartByUser(user_id);
    }
}
