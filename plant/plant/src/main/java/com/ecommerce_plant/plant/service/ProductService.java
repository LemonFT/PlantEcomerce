package com.ecommerce_plant.plant.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce_plant.plant.model.Product;
import com.ecommerce_plant.plant.repository.ProductRep;

@Service
public class ProductService {

    @Autowired
    ProductRep productRep;

    public List<Product> getAllProduct() {
        return productRep.findAllProducts();
    }

    public Product getProduct(int productId) {
        return productRep.findProduct(productId);
    }

    public boolean productSoldOut(int productId) {
        return !productRep.findProduct(productId).isDisplay();
    }

    public List<Product> getProductOfPageNum(String search, String min, String max, int[] categoryIds, int pageNum,
            int numPerPage) {
        int skipProductNum = (pageNum - 1) * numPerPage;
        Double minDouble, maxDouble;
        try {
            minDouble = Double.parseDouble(min);
            System.err.println(minDouble);
        } catch (Exception e) {
            minDouble = null;
        }
        try {
            maxDouble = Double.parseDouble(max);
            System.err.println(maxDouble);
        } catch (Exception e) {
            maxDouble = null;
        }

        return productRep.findProductOfPageNum(search, minDouble, maxDouble, categoryIds, numPerPage,
                skipProductNum);
    }

    public int getTotalAmountFilter(String search, String min, String max, int[] categoryIds) {
        Double minDouble, maxDouble;
        try {
            minDouble = Double.parseDouble(min);
        } catch (Exception e) {
            minDouble = null;
        }
        try {
            maxDouble = Double.parseDouble(max);
        } catch (Exception e) {
            maxDouble = null;
        }
        return productRep.totalAmountOfFilter(search, minDouble, maxDouble, categoryIds);
    }

    public Double getMaxPrice() {
        try {
            Double maxPrice = productRep.maxPriceProduct();
            return maxPrice;
        } catch (Exception e) {
            return 1000000.0;
        }
    }

    public String insertProduct(Product product) {
        product.setDeleted(false);
        if (product.getAmount() < 0 || product.getVoucher() < 0 || product.getVoucher() > 1 || product.getPrice() < 0) {
            return "Insert failed";
        }
        boolean result = productRep.insertProduct(product);
        return result ? "Insert successfully" : "Insert failed";
    }

    public String updateProduct(Product product) {
        product.setDeleted(false);
        boolean result = productRep.updateProduct(product);
        return result ? "Update successfully" : "Update failed, invalid data";
    }

    public boolean updateImageProduct(int id, String image) {
        return productRep.updateProductImage(id, image);
    }

    public String deleteProduct(int id) {
        try {
            return productRep.hardDeleteProduct(id) ? "Delete successfully" : "Delete failed";
        } catch (Exception e) {
            return productRep.SoftdeleteProduct(id) ? "Delete successfully" : "Delete failed";
        }
    }
}
