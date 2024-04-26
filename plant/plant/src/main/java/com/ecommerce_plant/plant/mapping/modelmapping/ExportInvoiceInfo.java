package com.ecommerce_plant.plant.mapping.modelmapping;

import java.util.List;

import com.ecommerce_plant.plant.model.ExportInvoice;
import com.ecommerce_plant.plant.model.ExportInvoiceDetail;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * ExportInvoiceInfo
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ExportInvoiceInfo {
    private ExportInvoice exportInvoice;
    private List<ExportInvoiceDetail> exportInvoiceDetails;

}