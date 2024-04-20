package com.ecommerce_plant.plant.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.ecommerce_plant.plant.mapping.ProductImagesMapping;
import com.ecommerce_plant.plant.mapping.modelmapping.ProductImagesModelMap;
import com.ecommerce_plant.plant.mapping.modelmapping.ProductModelMap;
import com.ecommerce_plant.plant.model.Product;
import com.ecommerce_plant.plant.model.ProductImage;
import com.ecommerce_plant.plant.service.ProductImageService;
import com.ecommerce_plant.plant.service.ProductService;

@Controller
@RequestMapping("")
public class ProductApi {

    @Autowired
    ProductService productServer;
    @Autowired
    ProductImagesMapping productImagesMapping;

    @Autowired
    ProductImageService productImageService;

    @GetMapping("api/product")
    public ResponseEntity<?> getAllProduct() {
        return ResponseEntity.ok().body(productServer.getAllProduct());
    }

    @GetMapping("api/product/{product_id}")
    public ResponseEntity<?> getProduct(@PathVariable int product_id) {
        Product product = productServer.getProduct(product_id);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        ProductImagesModelMap productImagesModelMap = productImagesMapping.getProductAndImages(product);
        return ResponseEntity.ok().body(productImagesModelMap);
    }

    @GetMapping("api/product/{numpage}/{numperpage}/filter")
    public ResponseEntity<?> getFilteredProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String min,
            @RequestParam(required = false) String max,
            @RequestParam(required = false) int[] categoryIds,
            @PathVariable int numpage,
            @PathVariable int numperpage) {
        List<Product> products = productServer.getProductOfPageNum(search, min, max,
                categoryIds, numpage, numperpage);
        int totalAmountFilter = productServer.getTotalAmountFilter(search, min, max,
                categoryIds);
        return ResponseEntity.ok().body(new ProductModelMap(products, totalAmountFilter));
    }

    @GetMapping("api/product/max-price")
    public ResponseEntity<?> getMaxPriceProduct() {
        return ResponseEntity.ok().body(Math.ceil(productServer.getMaxPrice()));
    }

    @PostMapping("authenticed/api/product")
    public ResponseEntity<?> insertProduct(@RequestBody Product product) {
        System.err.println(product.toString());
        String result = productServer.insertProduct(product);
        return (result != null && result.equals("Insert successfully")) ? ResponseEntity.ok().body(result)
                : ResponseEntity.badRequest().body(result);
    }

    @PutMapping("authenticed/api/product")
    public ResponseEntity<?> updateProduct(@RequestBody Product product) {
        if (product.getAmount() < 0 || product.getVoucher() < 0 || product.getVoucher() > 1 || product.getPrice() < 0) {
            return ResponseEntity.badRequest().body("Update failed, invalid data!");
        }
        String result = productServer.updateProduct(product);
        return (result != null && result.equals("Update successfully")) ? ResponseEntity.ok().body(result)
                : ResponseEntity.badRequest().body(result);
    }

    @DeleteMapping("authenticed/api/product/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable int id) {
        String result = productServer.deleteProduct(id);
        return (result != null && result.equals("Delete successfully")) ? ResponseEntity.ok().body(result)
                : ResponseEntity.badRequest().body(result);
    }

    @PutMapping("authenticed/api/product/image")
    public ResponseEntity<?> updateImage(@RequestBody Product product) {
        if (product.getImage() == null) {
            return ResponseEntity.badRequest().body("data not found");
        }
        boolean result = productServer.updateImageProduct(product.getId(), product.getImage());
        return result ? ResponseEntity.ok().body("Update successfully") : ResponseEntity.ok().body("Update false");
    }

    @PostMapping("authenticed/api/image")
    public ResponseEntity<?> insertImage(@RequestBody ProductImage productImage) {
        if (productImage.getImage() == null) {
            return ResponseEntity.badRequest().body("data not found");
        }
        System.err.println(productImage.toString());
        boolean result = productImageService.insertImage(productImage.getProduct_id(), productImage.getImage());
        return result ? ResponseEntity.ok().body("Insert successfully")
                : ResponseEntity.badRequest().body("Insert false");
    }

    @DeleteMapping("authenticed/api/image")
    public ResponseEntity<?> deleteImage(@RequestBody ProductImage productImage) {
        boolean result = productImageService.deleteImage(productImage.getProduct_id(), productImage.getImage());
        return result ? ResponseEntity.ok().body("Delete successfully")
                : ResponseEntity.badRequest().body("Delete false");
    }
}
