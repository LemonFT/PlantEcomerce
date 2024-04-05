package com.ecommerce_plant.plant.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ecommerce_plant.plant.model.ImportInvoice;

@Repository
public class ImportInvoiceRep {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<ImportInvoice> findAllImportInvoices() {
        String sql = "SELECT * FROM import_invoice";
        return jdbcTemplate.query(sql, BeanPropertyRowMapper.newInstance(ImportInvoice.class));
    }

    public boolean insertImportInvoice(ImportInvoice importInvoice) {
        String sql = "INSERT INTO import_invoice (supplier_id, init_time, user_id, total_pay) VALUES (?, ?, ?, ?)";
        return jdbcTemplate.update(sql, importInvoice.getSupplier_id(), importInvoice.getInit_time(),
                importInvoice.getUser_id(), importInvoice.getTotal_pay()) > 0;
    }

    public boolean updateImportInvoice(ImportInvoice importInvoice) {
        String sql = "UPDATE import_invoice SET supplier_id = ?, init_time = ?, user_id = ?, total_pay = ? WHERE id = ?";
        return jdbcTemplate.update(sql, importInvoice.getSupplier_id(), importInvoice.getInit_time(),
                importInvoice.getUser_id(), importInvoice.getTotal_pay(), importInvoice.getId()) > 0;
    }

    public boolean deleteImportInvoice(int id) {
        String sql = "DELETE FROM import_invoice WHERE id = ?";
        return jdbcTemplate.update(sql, id) > 0;
    }
}
