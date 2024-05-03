package com.ecommerce_plant.plant.mapping.modelmapping;

import com.ecommerce_plant.plant.model.Exchange;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * @author lemonftdev
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ExchangeModelMap {
    private int orderId;
    private Exchange exchange;
}
