package com.ecommerce_plant.plant.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ecommerce_plant.plant.mapping.CartMapping;
import com.ecommerce_plant.plant.model.Cart;
import com.ecommerce_plant.plant.service.CartService;
import com.ecommerce_plant.plant.service.ProductService;

@Controller
@RequestMapping("")
public class CartApi {

    @Autowired
    CartService cartService;
    @Autowired
    ProductService productService;
    @Autowired
    CartMapping cartMapping;

    @GetMapping("authenticed/api/cart/{userId}")
    public ResponseEntity<?> getProductsInCartUser(@PathVariable int userId) {
        List<Cart> productsCart = cartService.getProductsInCartUser(userId);
        return ResponseEntity.ok().body(cartMapping.getInfoProductInCart(productsCart));
    }

    @PostMapping("authenticed/api/cart")
    public ResponseEntity<?> insertCart(@RequestBody Cart info) {
        if (productService.productSoldOut(info.getProduct_id())) {
            return ResponseEntity.notFound().build();
        }
        return cartService.insertCart(info) ? ResponseEntity.ok().body("insert success")
                : ResponseEntity.notFound().build();
    }

    @DeleteMapping("authenticed/api/cart/{userId}/{productId}")
    public ResponseEntity<?> deleteProduct(@PathVariable int userId, @PathVariable int productId) {
        return cartService.deleteProductInCart(userId, productId) ? ResponseEntity.ok().body("delete success")
                : ResponseEntity.notFound().build();
    }

    @DeleteMapping("authenticed/api/cart/{userId}")
    public ResponseEntity<?> deleteAllProduct(@PathVariable int userId) {
        return cartService.deleteAllProductInCart(userId) ? ResponseEntity.ok().body("delete success")
                : ResponseEntity.notFound().build();
    }

}
