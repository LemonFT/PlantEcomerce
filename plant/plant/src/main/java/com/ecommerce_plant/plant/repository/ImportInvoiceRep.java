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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import com.ecommerce_plant.plant.model.ImportInvoice;
import com.ecommerce_plant.plant.model.ImportInvoiceDetail;

@Repository
@Transactional
public class ImportInvoiceRep {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Autowired
    private ImportInvoiceDetailRep importInvoiceDetailRep;

    public List<ImportInvoice> findAllImportInvoices() {
        String sql = "SELECT * FROM import_invoice";
        return jdbcTemplate.query(sql, BeanPropertyRowMapper.newInstance(ImportInvoice.class));
    }

    public boolean insertImportInvoice(ImportInvoice importInvoice) {
        String sql = "INSERT INTO import_invoice (supplier_id, init_time, user_id, total_pay) VALUES (?, ?, ?, ?)";
        return jdbcTemplate.update(sql, importInvoice.getSupplier_id(), importInvoice.getInit_time(),
                importInvoice.getUser_id(), importInvoice.getTotal_pay()) > 0;
    }

    public boolean insertImportInvoiceAndDetails(ImportInvoice importInvoice,
            List<ImportInvoiceDetail> importInvoiceDetails) {
        try {
            String sql = "INSERT INTO import_invoice (supplier_id, init_time, user_id, total_pay) VALUES (?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setInt(1, importInvoice.getSupplier_id());
                ps.setTimestamp(2, importInvoice.getInit_time());
                ps.setInt(3, importInvoice.getUser_id());
                ps.setDouble(4, importInvoice.getTotal_pay());
                return ps;
            }, keyHolder);
            int newKey = keyHolder.getKey().intValue();
            for (ImportInvoiceDetail importInvoiceDetail : importInvoiceDetails) {
                importInvoiceDetail.setImport_invoice_id(newKey);
                importInvoiceDetailRep.insertImportInvoiceDetail(importInvoiceDetail);
            }
            return true;
        } catch (Exception e) {
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
        }
        return false;
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
