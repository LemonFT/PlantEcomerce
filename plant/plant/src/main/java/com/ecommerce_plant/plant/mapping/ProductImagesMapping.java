package com.ecommerce_plant.plant.mapping;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ecommerce_plant.plant.mapping.modelmapping.ProductImagesModelMap;
import com.ecommerce_plant.plant.model.Product;
import com.ecommerce_plant.plant.model.ProductImage;
import com.ecommerce_plant.plant.service.ProductImageService;

@Component
public class ProductImagesMapping {
    @Autowired
    ProductImageService productImageService;

    public ProductImagesModelMap getProductAndImages(Product product) {
        List<ProductImage> productImages = productImageService.getAllImagesByProductId(product.getId());
        return new ProductImagesModelMap(product, productImages);
    }
}
