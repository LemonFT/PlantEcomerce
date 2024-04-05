package com.ecommerce_plant.plant.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce_plant.plant.model.ProductCategory;
import com.ecommerce_plant.plant.repository.ProductCategoryRep;

@Service
public class ProductCategoryService {

    @Autowired
    ProductCategoryRep productCategoryRep;

    public List<ProductCategory> getAllCategoryProduct() {
        return productCategoryRep.findAllProductCategorys();
    }
}
