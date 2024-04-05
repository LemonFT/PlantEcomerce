package com.ecommerce_plant.plant.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ecommerce_plant.plant.model.ProductImage;

@Repository
public class ProductImageRep {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @SuppressWarnings("deprecation")
    public List<ProductImage> findByProductId(int productId) {
        String sql = "SELECT * FROM product_image WHERE product_id = ?";
        try {
            return jdbcTemplate.query(sql, new Object[] { productId },
                    BeanPropertyRowMapper.newInstance(ProductImage.class));
        } catch (Exception e) {
            return null;
        }
    }

    public boolean save(int product_id, String image) {
        String sql = "INSERT INTO product_image (product_id, image) VALUES (?, ?)";
        return jdbcTemplate.update(sql, product_id, image) > 0;
    }

    public boolean update(ProductImage productImage) {
        String sql = "UPDATE product_image SET image = ? WHERE product_id = ?";
        return jdbcTemplate.update(sql, productImage.getImage(), productImage.getProduct_id()) > 0;
    }

    public boolean deleteByProductId(int productId, String image) {
        String sql = "DELETE FROM product_image WHERE product_id = ? and image = ?";
        boolean rs = false;
        try {
            rs = jdbcTemplate.update(sql, productId, image) > 0;
        } catch (Exception e) {
            System.err.println(e);
        }
        return rs;
    }
}
