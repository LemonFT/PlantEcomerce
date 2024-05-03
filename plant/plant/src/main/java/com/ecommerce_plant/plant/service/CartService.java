package com.ecommerce_plant.plant.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce_plant.plant.model.Cart;
import com.ecommerce_plant.plant.model.Product;
import com.ecommerce_plant.plant.repository.CartRep;
import com.ecommerce_plant.plant.repository.ProductRep;

/**
 * @author lemonftdev
 */
@Service
public class CartService {
    @Autowired
    CartRep cartRep;
    @Autowired
    ProductRep productRep;

    public List<Cart> getProductsInCartUser(int userId) {
        return cartRep.findAllCartsByUserId(userId);
    }

    public boolean insertCart(Cart cart) {
        Product product = productRep.findProduct(cart.getProduct_id());
        if (product.getAmount() < cart.getNumber()) {
            return false;
        }
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

    public boolean deleteProductInCart(int userId, int productId) {
        return cartRep.deleteCart(userId, productId);
    }

    public boolean deleteAllProductInCart(int userId) {
        return cartRep.deleteAllCartByUser(userId);
    }
}
