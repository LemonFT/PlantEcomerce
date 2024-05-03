package com.ecommerce_plant.plant.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * @author lemonftdev
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Exchange {
    private int id;
    private String transactionNo;
    private int payTypeId;
}
