package com.ecommerce_plant.plant.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce_plant.plant.model.ProductImage;
import com.ecommerce_plant.plant.repository.ProductImageRep;

@Service
public class ProductImageService {
    @Autowired
    ProductImageRep productImageRep;

    public List<ProductImage> getAllImagesByProductId(int product_id) {
        return productImageRep.findByProductId(product_id);
    }

    public boolean insertImage(int product_id, String image) {
        return productImageRep.save(product_id, image);
    }

    public boolean deleteImage(int product_id, String image) {
        return productImageRep.deleteByProductId(product_id, image);
    }
}
