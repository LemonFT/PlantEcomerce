package com.ecommerce_plant.plant.service;

import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import com.ecommerce_plant.plant.repository.ProgressingOrderRep;

/**
 * @author lemonftdev
 */
@Service
@Transactional(rollbackFor = { SQLException.class, DataAccessException.class })
public class ProgressingOrderService {

    @Autowired
    ProgressingOrderRep progressingOrderRep;

    public boolean updateStatusProgressingOrder(int orderId, int statusOrder) {
        return progressingOrderRep.updateStatusProgressingOrder(orderId, statusOrder);
    }

    public boolean updateStatusProgressingOrders(List<Integer> orders, int status) {
        try {
            for (Integer orderId : orders) {
                progressingOrderRep.updateStatusProgressingOrder(orderId, status);
            }
            return true;
        } catch (Exception e) {
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
        }
        return false;
    }

}
