package com.ecommerce_plant.plant.mapping.modelmapping;

import java.util.List;

import com.ecommerce_plant.plant.model.Order;
import com.ecommerce_plant.plant.model.OrderItem;

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
public class OrderModelMap {
    private Order order;
    private List<OrderItem> orderItems;
}
