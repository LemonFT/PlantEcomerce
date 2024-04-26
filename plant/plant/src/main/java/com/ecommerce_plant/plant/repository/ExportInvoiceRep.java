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
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import com.ecommerce_plant.plant.model.ExportInvoice;
import com.ecommerce_plant.plant.model.ExportInvoiceDetail;

@Repository
public class ExportInvoiceRep {
    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Autowired
    private ExportInvoiceDetailRep exportInvoiceDetailRep;

    public List<ExportInvoice> findAllExportInvoices() {
        String sql = "SELECT * FROM export_invoice";
        return jdbcTemplate.query(sql, BeanPropertyRowMapper.newInstance(ExportInvoice.class));
    }

    public boolean insertExportInvoice(ExportInvoice exportInvoice) {
        String sql = "INSERT INTO export_invoice (user_id, init_time, total_loss) VALUES (?, ?, ?)";
        return jdbcTemplate.update(sql, exportInvoice.getUser_id(), exportInvoice.getInit_time(),
                exportInvoice.getTotal_loss()) > 0;
    }

    public boolean insertExportInvoiceAndDetails(ExportInvoice exportInvoice,
            List<ExportInvoiceDetail> exportInvoiceDetails) {
        try {
            String sql = "INSERT INTO export_invoice (user_id, init_time, total_loss) VALUES (?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setInt(1, exportInvoice.getUser_id());
                ps.setTimestamp(2, exportInvoice.getInit_time());
                ps.setDouble(3, exportInvoice.getTotal_loss());
                return ps;
            }, keyHolder);
            int newKey = keyHolder.getKey().intValue();
            for (ExportInvoiceDetail exportInvoiceDetail : exportInvoiceDetails) {
                exportInvoiceDetail.setExport_invoice_id(newKey);
                exportInvoiceDetailRep.insertExportInvoiceDetail(exportInvoiceDetail);
            }
            return true;
        } catch (Exception e) {
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
        }
        return false;
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
