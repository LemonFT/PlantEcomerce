package com.ecommerce_plant.plant.model;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SuccessOrder {
    private int order_id;
    private int exchange_id;
    private Date delivery_time;
    private Date complete_time;
}
