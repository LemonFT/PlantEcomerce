package com.ecommerce_plant.plant.controller;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ecommerce_plant.plant.mapping.modelmapping.ImportInvoiceInfo;
import com.ecommerce_plant.plant.model.ImportInvoice;
import com.ecommerce_plant.plant.model.ImportInvoiceDetail;
import com.ecommerce_plant.plant.service.ImportInvoiceService;

/**
 * @author lemonftdev
 */
@RequestMapping("")
@Controller
public class ImportInvoiceApi {

    @Autowired
    ImportInvoiceService importInvoiceService;

    @GetMapping("authenticed/api/imports")
    public ResponseEntity<?> getAllImportInvoice() {
        ImportInvoice importInvoice = new ImportInvoice(1, 1, new Timestamp(System.currentTimeMillis()), 1, 3.4);
        ImportInvoiceDetail importInvoiceDetail = new ImportInvoiceDetail(1, 10, 10, 100);
        List<ImportInvoiceDetail> importInvoiceDetails = new ArrayList<>();
        importInvoiceDetails.add(importInvoiceDetail);
        importInvoiceDetails.add(importInvoiceDetail);
        importInvoiceDetails.add(importInvoiceDetail);
        return ResponseEntity.ok().body(new ImportInvoiceInfo(importInvoice, importInvoiceDetails));
    }

    @GetMapping("authenticed/api/import-cost/{year}")
    public ResponseEntity<?> getCostOfGoodsSoldByYears(@PathVariable int year) {
        return ResponseEntity.ok().body(importInvoiceService.getCostOfGoodsSoldByYears(year));
    }

    @PostMapping("authenticed/api/import")
    public ResponseEntity<?> insertImportInvoice(@RequestBody ImportInvoiceInfo importInvoiceInfo) {
        ImportInvoice importInvoice = importInvoiceInfo.getImportInvoice();
        List<ImportInvoiceDetail> importInvoiceDetails = importInvoiceInfo.getImportInvoiceDetails();
        boolean resultInsert = importInvoiceService.insertImportInvoice(importInvoice, importInvoiceDetails);
        return resultInsert ? ResponseEntity.ok().body(200) : ResponseEntity.badRequest().body(400);
    }

}
