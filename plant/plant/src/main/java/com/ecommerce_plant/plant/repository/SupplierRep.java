package com.ecommerce_plant.plant.repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import com.ecommerce_plant.plant.model.Supplier;

@Repository
public class SupplierRep {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Supplier> findAllSuppliers() {
        String sql = "SELECT * FROM supplier WHERE deleted = false";
        return jdbcTemplate.query(sql, BeanPropertyRowMapper.newInstance(Supplier.class));
    }

    public int insertSupplier(Supplier supplier) {
        try {
            String sql = "INSERT INTO supplier (name, gmail, phone_number, address) VALUES (?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, supplier.getName());
                ps.setString(2, supplier.getGmail());
                ps.setString(3, supplier.getPhone_number());
                ps.setString(4, supplier.getAddress());
                return ps;
            }, keyHolder);
            return keyHolder.getKey().intValue();
        } catch (Exception e) {
            System.err.println(e);
        }
        return -1;
    }

    public boolean updateSupplier(Supplier supplier) {
        String sql = "UPDATE supplier SET name = ?, gmail = ?, phone_number = ?, address = ? WHERE id = ?";
        return jdbcTemplate.update(sql, supplier.getName(), supplier.getGmail(), supplier.getPhone_number(),
                supplier.getAddress(), supplier.getId()) > 0;
    }

    public boolean deleteSupplier(int id) {
        String sql = "UPDATE supplier SET deleted = true WHERE id = ?";
        return jdbcTemplate.update(sql, id) > 0;
    }
}
