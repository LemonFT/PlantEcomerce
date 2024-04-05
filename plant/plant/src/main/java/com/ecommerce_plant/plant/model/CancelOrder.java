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
public class CancelOrder {
    private int order_id;
    private int exchange_id;
    private String refund_code;
    private Date cancel_time;
    private String cancel_purpose;
}
