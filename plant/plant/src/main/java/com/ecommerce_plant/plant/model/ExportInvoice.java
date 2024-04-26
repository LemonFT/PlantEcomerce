package com.ecommerce_plant.plant.model;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ExportInvoice {
    private int id;
    private int user_id;
    private Timestamp init_time;
    private double total_loss;
}
