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

    @GetMapping("authenticed/api/cart/{user_id}")
    public ResponseEntity<?> getProductsInCartUser(@PathVariable int user_id) {
        List<Cart> productsCart = cartService.getProductsInCartUser(user_id);
        return ResponseEntity.ok().body(cartMapping.getInfoProductInCart(productsCart));
    }

    @PostMapping("authenticed/api/cart")
    public ResponseEntity<?> insertCart(@RequestBody Cart info) {
        if (productService.productSoldOut(info.getProduct_id())) {
            return ResponseEntity.notFound().build();
        }
        return cartService.insertCart(info) ? ResponseEntity.ok().body("insert success")
                : ResponseEntity.badRequest().body("no internet");
    }

    @DeleteMapping("authenticed/api/cart/{user_id}/{product_id}")
    public ResponseEntity<?> deleteProduct(@PathVariable int user_id, @PathVariable int product_id) {
        return cartService.deleteProductInCart(user_id, product_id) ? ResponseEntity.ok().body("delete success")
                : ResponseEntity.notFound().build();
    }

    @DeleteMapping("authenticed/api/cart/{user_id}")
    public ResponseEntity<?> deleteAllProduct(@PathVariable int user_id) {
        return cartService.deleteAllProductInCart(user_id) ? ResponseEntity.ok().body("delete success")
                : ResponseEntity.notFound().build();
    }

}
