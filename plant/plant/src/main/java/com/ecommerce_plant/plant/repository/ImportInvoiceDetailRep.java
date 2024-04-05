package com.ecommerce_plant.plant.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ecommerce_plant.plant.model.ImportInvoiceDetail;

@Repository
public class ImportInvoiceDetailRep {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<ImportInvoiceDetail> findAllImportInvoiceDetails() {
        String sql = "SELECT * FROM import_invoice_detail";
        return jdbcTemplate.query(sql, BeanPropertyRowMapper.newInstance(ImportInvoiceDetail.class));
    }

    public boolean insertImportInvoiceDetail(ImportInvoiceDetail importInvoiceDetail) {
        String sql = "INSERT INTO import_invoice_detail (import_invoice_id, product_id, number, price) VALUES (?, ?, ?, ?)";
        return jdbcTemplate.update(sql, importInvoiceDetail.getImport_invoice_id(), importInvoiceDetail.getProduct_id(),
                importInvoiceDetail.getNumber(), importInvoiceDetail.getPrice()) > 0;
    }

    public boolean updateImportInvoiceDetail(ImportInvoiceDetail importInvoiceDetail) {
        String sql = "UPDATE import_invoice_detail SET number = ?, price = ? WHERE import_invoice_id = ? AND product_id = ?";
        return jdbcTemplate.update(sql, importInvoiceDetail.getNumber(), importInvoiceDetail.getPrice(),
                importInvoiceDetail.getImport_invoice_id(), importInvoiceDetail.getProduct_id()) > 0;
    }

    public boolean deleteImportInvoiceDetail(int importInvoiceId, int productId) {
        String sql = "DELETE FROM import_invoice_detail WHERE import_invoice_id = ? AND product_id = ?";
        return jdbcTemplate.update(sql, importInvoiceId, productId) > 0;
    }
}
