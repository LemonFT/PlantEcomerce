package com.ecommerce_plant.plant.service;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce_plant.plant.model.ExportInvoice;
import com.ecommerce_plant.plant.model.ExportInvoiceDetail;
import com.ecommerce_plant.plant.repository.ExportInvoiceRep;

@Service
public class ExportInvoiceService {
    @Autowired
    ExportInvoiceRep exportInvoiceRep;

    public boolean insertInvoiceExport(ExportInvoice exportInvoice, List<ExportInvoiceDetail> exportInvoiceDetails) {
        exportInvoice.setInit_time(new Timestamp(System.currentTimeMillis()));
        return exportInvoiceRep.insertExportInvoiceAndDetails(exportInvoice, exportInvoiceDetails);
    }
}
