package com.ecommerce_plant.plant.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ecommerce_plant.plant.model.ExportInvoiceDetail;

@Repository
public class ExportInvoiceDetailRep {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<ExportInvoiceDetail> findAllExportInvoiceDetails() {
        String sql = "SELECT * FROM export_invoice_detail";
        return jdbcTemplate.query(sql, BeanPropertyRowMapper.newInstance(ExportInvoiceDetail.class));
    }

    public boolean insertExportInvoiceDetail(ExportInvoiceDetail exportInvoiceDetail) {
        String sql = "INSERT INTO export_invoice_detail (export_invoice_id, product_id, number, price) VALUES (?, ?, ?, ?)";
        return jdbcTemplate.update(sql, exportInvoiceDetail.getExport_invoice_id(), exportInvoiceDetail.getProduct_id(),
                exportInvoiceDetail.getNumber(), exportInvoiceDetail.getPrice()) > 0;
    }

    public boolean updateExportInvoiceDetail(ExportInvoiceDetail exportInvoiceDetail) {
        String sql = "UPDATE export_invoice_detail SET number = ?, price = ? WHERE export_invoice_id = ? AND product_id = ?";
        return jdbcTemplate.update(sql, exportInvoiceDetail.getNumber(), exportInvoiceDetail.getPrice(),
                exportInvoiceDetail.getExport_invoice_id(), exportInvoiceDetail.getProduct_id()) > 0;
    }

    public boolean deleteExportInvoiceDetail(int exportInvoiceId, int productId) {
        String sql = "DELETE FROM export_invoice_detail WHERE export_invoice_id = ? AND product_id = ?";
        return jdbcTemplate.update(sql, exportInvoiceId, productId) > 0;
    }
}
