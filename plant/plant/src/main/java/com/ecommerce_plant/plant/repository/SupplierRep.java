package com.ecommerce_plant.plant.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ecommerce_plant.plant.model.Supplier;

@Repository
public class SupplierRep {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Supplier> findAllSuppliers() {
        String sql = "SELECT * FROM supplier";
        return jdbcTemplate.query(sql, BeanPropertyRowMapper.newInstance(Supplier.class));
    }

    public boolean insertSupplier(Supplier supplier) {
        String sql = "INSERT INTO supplier (name, gmail, phone_number, address) VALUES (?, ?, ?, ?)";
        return jdbcTemplate.update(sql, supplier.getName(), supplier.getGmail(), supplier.getPhone_number(),
                supplier.getAddress()) > 0;
    }

    public boolean updateSupplier(Supplier supplier) {
        String sql = "UPDATE supplier SET name = ?, gmail = ?, phone_number = ?, address = ? WHERE id = ?";
        return jdbcTemplate.update(sql, supplier.getName(), supplier.getGmail(), supplier.getPhone_number(),
                supplier.getAddress(), supplier.getId()) > 0;
    }

    public boolean deleteSupplier(int id) {
        String sql = "DELETE FROM supplier WHERE id = ?";
        return jdbcTemplate.update(sql, id) > 0;
    }
}
