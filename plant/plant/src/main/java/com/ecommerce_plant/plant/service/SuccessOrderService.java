package com.ecommerce_plant.plant.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce_plant.plant.mapping.modelmapping.CostOfGoodsSoldByYear;
import com.ecommerce_plant.plant.repository.SuccessOrderRep;

/**
 * @author lemonftdev
 */
@Service
public class SuccessOrderService {
    @Autowired
    SuccessOrderRep successOrderRep;

    public List<CostOfGoodsSoldByYear> getTotalRevenueFromSuccessOrder(int year) {
        return successOrderRep.getTotalRevenueFromSuccessOrder(year);
    }

    public Double getTotalRevenueFromSuccessOrderAndCash(int year) {
        return successOrderRep.getTotalRevenueFromSuccessOrderAndCash(year);
    }

    public Double getTotalRevenueFromSuccessOrderAndVnPay(int year) {
        return successOrderRep.getTotalRevenueFromSuccessOrderAndVnPay(year);
    }
}
