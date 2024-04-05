package com.ecommerce_plant.plant.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ecommerce_plant.plant.model.ExportInvoice;

@Repository
public class ExportInvoiceRep {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<ExportInvoice> findAllExportInvoices() {
        String sql = "SELECT * FROM export_invoice";
        return jdbcTemplate.query(sql, BeanPropertyRowMapper.newInstance(ExportInvoice.class));
    }

    public boolean insertExportInvoice(ExportInvoice exportInvoice) {
        String sql = "INSERT INTO export_invoice (user_id, init_time, total_loss) VALUES (?, ?, ?)";
        return jdbcTemplate.update(sql, exportInvoice.getUser_id(), exportInvoice.getInit_time(),
                exportInvoice.getTotal_loss()) > 0;
    }

    public boolean updateExportInvoice(ExportInvoice exportInvoice) {
        String sql = "UPDATE export_invoice SET user_id = ?, init_time = ?, total_loss = ? WHERE id = ?";
        return jdbcTemplate.update(sql, exportInvoice.getUser_id(), exportInvoice.getInit_time(),
                exportInvoice.getTotal_loss(), exportInvoice.getId()) > 0;
    }

    public boolean deleteExportInvoice(int id) {
        String sql = "DELETE FROM export_invoice WHERE id = ?";
        return jdbcTemplate.update(sql, id) > 0;
    }
}
