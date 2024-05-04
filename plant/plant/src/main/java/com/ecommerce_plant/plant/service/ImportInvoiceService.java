package com.ecommerce_plant.plant.service;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce_plant.plant.mapping.modelmapping.CostOfGoodsSoldByYear;
import com.ecommerce_plant.plant.model.ImportInvoice;
import com.ecommerce_plant.plant.model.ImportInvoiceDetail;
import com.ecommerce_plant.plant.repository.ImportInvoiceRep;

/**
 * @author lemonftdev
 */
@Service
public class ImportInvoiceService {

    @Autowired
    ImportInvoiceRep importInvoiceRep;

    public boolean insertImportInvoice(ImportInvoice importInvoice, List<ImportInvoiceDetail> importInvoiceDetails) {
        importInvoice.setInit_time(new Timestamp(System.currentTimeMillis()));
        return importInvoiceRep.insertImportInvoiceAndDetails(importInvoice, importInvoiceDetails);
    }

    public List<CostOfGoodsSoldByYear> getCostOfGoodsSoldByYears(int year) {
        return importInvoiceRep.findAllCostByYear(year);
    }

    public Double getCostByYear(int year) {
        return importInvoiceRep.findCostByYear(year);
    }
}
