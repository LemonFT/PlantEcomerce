package com.ecommerce_plant.plant.mapping.modelmapping;

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
public class CategoryNumberProduct {
    private int categoryId;
    private String categoryName;
    private int amount;
}
