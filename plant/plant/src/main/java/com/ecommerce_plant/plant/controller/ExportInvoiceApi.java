package com.ecommerce_plant.plant.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ecommerce_plant.plant.mapping.modelmapping.ExportInvoiceInfo;
import com.ecommerce_plant.plant.model.ExportInvoice;
import com.ecommerce_plant.plant.model.ExportInvoiceDetail;
import com.ecommerce_plant.plant.service.ExportInvoiceService;

@RequestMapping("")
@Controller
public class ExportInvoiceApi {

    @Autowired
    ExportInvoiceService exportInvoiceService;

    @PostMapping("/authenticed/api/export")
    public ResponseEntity<?> insertExportInvoice(@RequestBody ExportInvoiceInfo exportInvoiceInfo) {
        ExportInvoice exportInvoice = exportInvoiceInfo.getExportInvoice();
        List<ExportInvoiceDetail> exportInvoiceDetails = exportInvoiceInfo.getExportInvoiceDetails();
        boolean result = exportInvoiceService.insertInvoiceExport(exportInvoice, exportInvoiceDetails);
        return result ? ResponseEntity.ok().body(200) : ResponseEntity.badRequest().body(400);
    }
}
