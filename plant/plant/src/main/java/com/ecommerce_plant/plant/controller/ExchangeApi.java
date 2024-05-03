package com.ecommerce_plant.plant.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ecommerce_plant.plant.mapping.modelmapping.ExchangeModelMap;
import com.ecommerce_plant.plant.service.ExchangeService;

/**
 * @author lemonftdev
 */
@RequestMapping("")
@Controller
public class ExchangeApi {
    @Autowired
    ExchangeService exchangeService;

    @PostMapping("authenticed/api/exchange")
    public ResponseEntity<?> insertExchange(@RequestBody ExchangeModelMap exchangeModelMap) {
        System.err.println(exchangeModelMap.toString());
        System.err.println(exchangeModelMap.getExchange().toString());
        boolean resultInsert = exchangeService.insertExchange(exchangeModelMap);
        return resultInsert ? ResponseEntity.ok().body(200) : ResponseEntity.badRequest().body(400);
    }
}