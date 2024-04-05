package com.ecommerce_plant.plant.mapping.modelmapping;

import com.ecommerce_plant.plant.model.Message;
import com.ecommerce_plant.plant.model.User;

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
public class MessageModelMap {
    private User user;
    private Message message;
}