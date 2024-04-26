package com.ecommerce_plant.plant.mapping.modelmapping;

import java.util.List;

import com.ecommerce_plant.plant.model.ImportInvoice;
import com.ecommerce_plant.plant.model.ImportInvoiceDetail;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * ImportInvoiceInfo
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ImportInvoiceInfo {
    private ImportInvoice importInvoice;
    private List<ImportInvoiceDetail> importInvoiceDetails;
}