package com.ecommerce_plant.plant.model;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ImportInvoice {
    private int id;
    private int supplier_id;
    private Timestamp init_time;
    private int user_id;
    private double total_pay;
}
