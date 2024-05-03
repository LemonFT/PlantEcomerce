package com.ecommerce_plant.plant.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce_plant.plant.mapping.modelmapping.ExchangeModelMap;
import com.ecommerce_plant.plant.repository.ExchangeRep;

/**
 * @author lemonftdev
 */
@Service
public class ExchangeService {
    @Autowired
    ExchangeRep exchangeRep;

    public boolean insertExchange(ExchangeModelMap exChangeModelMap) {
        return exchangeRep.insertExchange(exChangeModelMap);
    }
}
