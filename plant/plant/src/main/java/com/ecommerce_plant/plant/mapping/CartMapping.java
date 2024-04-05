package com.ecommerce_plant.plant.mapping;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ecommerce_plant.plant.mapping.modelmapping.CartModelMap;
import com.ecommerce_plant.plant.model.Cart;
import com.ecommerce_plant.plant.model.Product;
import com.ecommerce_plant.plant.service.ProductService;

@Component
public class CartMapping {
    @Autowired
    ProductService productService;

    public List<CartModelMap> getInfoProductInCart(List<Cart> productsCart) {
        List<CartModelMap> listProductInCart = new ArrayList<>();
        for (Cart item : productsCart) {
            Product product = productService.getProduct(item.getProduct_id());
            CartModelMap cartModelMap = new CartModelMap(item.getNumber(), product);
            listProductInCart.add(cartModelMap);
        }
        return listProductInCart;
    }
}
