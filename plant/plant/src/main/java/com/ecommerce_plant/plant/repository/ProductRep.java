package com.ecommerce_plant.plant.repository;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ecommerce_plant.plant.model.Product;

@Repository
public class ProductRep {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Product> findAllProducts() {
        String sql = "SELECT * FROM product where  deleted = false";
        return jdbcTemplate.query(sql, BeanPropertyRowMapper.newInstance(Product.class));
    }

    // cart
    @SuppressWarnings("deprecation")
    public Product findProduct(int product_id) {
        String sql = "SELECT * FROM product where id = ? and deleted = false";
        return jdbcTemplate.queryForObject(sql, new Object[] { product_id },
                BeanPropertyRowMapper.newInstance(Product.class));
    }

    @SuppressWarnings("deprecation")
    public List<Product> findProductOfPageNum(String search, Double min, Double max, int[] category_ids, int numPerPage,
            int skipProductNum) {
        String sql = "SELECT * FROM product WHERE ";
        List<Object> params = new ArrayList<>();

        if (search != null) {
            sql += "name LIKE ? AND ";
            params.add("%" + search + "%");
        }
        if (min != null) {
            sql += "price >= ? AND ";
            params.add(min);
        }
        if (max != null) {
            sql += "price <= ? AND ";
            params.add(max);
        }
        if (category_ids.length != 0) {
            sql += "(";
            for (int i = 0; i < category_ids.length; i++) {
                sql += "category_product_id = ?";
                params.add(category_ids[i]);
                if (i < category_ids.length - 1) {
                    sql += " OR ";
                }
            }
            sql += ") AND ";
        }

        sql += "display = true AND deleted = false LIMIT ? OFFSET ?";
        params.add(numPerPage);
        params.add(skipProductNum);
        return jdbcTemplate.query(sql, params.toArray(), BeanPropertyRowMapper.newInstance(Product.class));
    }

    @SuppressWarnings({ "deprecation" })
    public int totalAmountOfFilter(String search, Double min, Double max, int[] category_ids) {
        String sql = "SELECT count(id) FROM product WHERE ";
        List<Object> params = new ArrayList<>();

        if (search != null) {
            sql += "name LIKE ? ";
            params.add("%" + search + "%");
        }
        if (min != null) {
            sql += "AND price >= ? ";
            params.add(min);
        }
        if (max != null) {
            sql += "AND price <= ? ";
            params.add(max);
        }
        if (category_ids.length != 0) {
            sql += "AND (";
            for (int i = 0; i < category_ids.length; i++) {
                sql += "category_product_id = ? ";
                params.add(category_ids[i]);
                if (i < category_ids.length - 1) {
                    sql += " OR ";
                }
            }
            sql += ")";
        }
        return jdbcTemplate.queryForObject(sql, params.toArray(), (Integer.class));
    }

    public Double maxPriceProduct() {
        String sql = "SELECT MAX(price) from product";
        return jdbcTemplate.queryForObject(sql, (Double.class));
    }

    public boolean insertProduct(Product product) {
        String sql = "INSERT INTO product (code, name, category_product_id, description, amount, price, voucher) VALUES (?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, product.getCode(), product.getName(), product.getCategory_product_id(),
                product.getDescription(), product.getAmount(), product.getPrice(), product.getVoucher()) > 0;
    }

    public boolean updateProduct(Product product) {
        String sql = "UPDATE product SET name = ?, category_product_id = ?, description = ?, amount = ?, price = ?, voucher = ?, display = ? WHERE id = ?";
        return jdbcTemplate.update(sql, product.getName(), product.getCategory_product_id(),
                product.getDescription(), product.getAmount(), product.getPrice(), product.getVoucher(),
                product.isDisplay(), product.getId()) > 0;
    }

    public boolean updateProductImage(int id, String image) {
        String sql = "UPDATE product SET image = ? where id = ?";
        return jdbcTemplate.update(sql, image, id) > 0;
    }

    public boolean hardDeleteProduct(int id) {
        String sql = "DELETE FROM product WHERE id = ?";
        return jdbcTemplate.update(sql, id) > 0;
    }

    public boolean SoftdeleteProduct(int id) {
        String sql = "UPDATE product SET deleted = ?, display = ? WHERE id = ?";
        return jdbcTemplate.update(sql, 1, 0, id) > 0;
    }
}
