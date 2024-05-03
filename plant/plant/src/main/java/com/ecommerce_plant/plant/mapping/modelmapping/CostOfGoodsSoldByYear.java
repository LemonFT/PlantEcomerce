package com.ecommerce_plant.plant.mapping.modelmapping;

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
public class CostOfGoodsSoldByYear {
    private int month;
    private int cost;
}
