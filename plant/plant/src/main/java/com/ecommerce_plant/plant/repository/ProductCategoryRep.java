package com.ecommerce_plant.plant.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ecommerce_plant.plant.model.ProductCategory;

@Repository
public class ProductCategoryRep {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<ProductCategory> findAllProductCategorys() {
        String sql = "select * from product_category";
        return jdbcTemplate.query(sql, BeanPropertyRowMapper.newInstance(ProductCategory.class));
    }

    public boolean insertProductCategory(ProductCategory productCategory) {
        String sql = "insert into product_category (name, species_properties) value (?,?)";
        return jdbcTemplate.update(sql, productCategory.getName(), productCategory.getSpecies_properties()) > 0;
    }

    public boolean updateProductCategory(ProductCategory productCategory) {
        String sql = "update product_category set name = ?, species_properties = ? where id = ?";
        return jdbcTemplate.update(sql, productCategory.getName(), productCategory.getSpecies_properties(),
                productCategory.getId()) > 0;
    }

    public boolean deleteProductCategory(int id) {
        String sql = "delete from product_category where id = ?";
        return jdbcTemplate.update(sql, id) > 0;
    }
}