package com.ecommerce_plant.plant.repository;

import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import com.ecommerce_plant.plant.mapping.modelmapping.ExchangeModelMap;
import com.ecommerce_plant.plant.model.CancelOrder;
import com.ecommerce_plant.plant.model.Exchange;
import com.ecommerce_plant.plant.model.ProgressingOrder;
import com.ecommerce_plant.plant.model.SuccessOrder;

/**
 * @author lemonftdev
 */
@Repository
@Transactional(rollbackFor = { SQLException.class, DataAccessException.class })
public class ProgressingOrderRep {

    private static final int STT_DELIVERY = 2;
    private static final int STT_SUCCESS = 3;
    private static final int STT_CANCEL = 4;
    private static final int STT_CANCEL_ADMIN = 5;
    private static final int TYPE_PAY_CASH = 1;

    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Autowired
    private SuccessOrderRep successOrderRep;
    @Autowired
    private CancelOrderRep cancelOrderRep;
    @Autowired
    private ExchangeRep exchangeRep;

    public List<ProgressingOrder> findAllProgressingOrders() {
        String sql = "SELECT * FROM progressing_order";
        return jdbcTemplate.query(sql, BeanPropertyRowMapper.newInstance(ProgressingOrder.class));
    }

    @SuppressWarnings("deprecation")
    public ProgressingOrder findProgressingByOrderId(int orderId) {
        String sql = "SELECT * FROM progressing_order WHERE order_id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new Object[] { orderId },
                    BeanPropertyRowMapper.newInstance(ProgressingOrder.class));
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public boolean insertProgressingOrder(ProgressingOrder progressingOrder) {
        String sql = "INSERT INTO progressing_order (order_id, status_order, exchange_id, delivery_time, cancel_purpose) VALUES (?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, progressingOrder.getOrderId(), progressingOrder.getStatusOrder(),
                progressingOrder.getExchangeId(), progressingOrder.getDeliveryTime(),
                progressingOrder.getCancelPurpose()) > 0;
    }

    public boolean updateProgressingOrder(ProgressingOrder progressingOrder) {
        String sql = "UPDATE progressing_order SET status_order = ?, exchange_id = ?, delivery_time = ?, cancel_purpose = ? WHERE order_id = ?";
        return jdbcTemplate.update(sql, progressingOrder.getStatusOrder(), progressingOrder.getExchangeId(),
                progressingOrder.getDeliveryTime(), progressingOrder.getCancelPurpose(),
                progressingOrder.getOrderId()) > 0;
    }

    public boolean updateExchangeProgressingOrder(int orderId, int exchangeId) {
        String sql = "UPDATE progressing_order SET exchange_id = ? WHERE order_id = ?";
        return jdbcTemplate.update(sql, exchangeId, orderId) > 0;
    }

    public boolean updateStatusProgressingOrder(int orderId, int statusOrder) {
        try {
            if (statusOrder == STT_DELIVERY) {
                String sql = "UPDATE progressing_order SET status_order = ?, delivery_time = ? WHERE order_id = ?";
                jdbcTemplate.update(sql, statusOrder, new Timestamp(System.currentTimeMillis()), orderId);
            } else {
                String sql = "UPDATE progressing_order SET status_order = ? WHERE order_id = ?";
                jdbcTemplate.update(sql, statusOrder, orderId);
            }
            if (statusOrder == STT_SUCCESS) {
                ProgressingOrder progressingOrder = findProgressingByOrderId(orderId);
                Integer exchangeId = progressingOrder.getExchangeId();
                if (exchangeId == null) {
                    exchangeRep
                            .insertExchange(new ExchangeModelMap(orderId, new Exchange(0, "", TYPE_PAY_CASH)));
                    ProgressingOrder progressingOrderAfterUpdateExchange = findProgressingByOrderId(orderId);
                    SuccessOrder successOrder = new SuccessOrder(orderId,
                            progressingOrderAfterUpdateExchange.getExchangeId(),
                            progressingOrder.getDeliveryTime(), new Timestamp(System.currentTimeMillis()));
                    successOrderRep.insertSuccessOrder(successOrder);
                } else {
                    SuccessOrder successOrder = new SuccessOrder(orderId, progressingOrder.getExchangeId(),
                            progressingOrder.getDeliveryTime(), new Timestamp(System.currentTimeMillis()));
                    successOrderRep.insertSuccessOrder(successOrder);
                }
            } else if (statusOrder == STT_CANCEL || statusOrder == STT_CANCEL_ADMIN) {
                ProgressingOrder progressingOrder = findProgressingByOrderId(orderId);
                Integer exchangeId = progressingOrder.getExchangeId();
                if (exchangeId == null) {
                    exchangeRep
                            .insertExchange(new ExchangeModelMap(orderId, new Exchange(0, "", TYPE_PAY_CASH)));
                    ProgressingOrder progressingOrderAfterUpdateExchange = findProgressingByOrderId(orderId);
                    CancelOrder cancelOrder = new CancelOrder(orderId,
                            progressingOrderAfterUpdateExchange.getExchangeId(), "",
                            new Timestamp(System.currentTimeMillis()), "");
                    cancelOrderRep.insertCancelOrder(cancelOrder);
                } else {
                    CancelOrder cancelOrder = new CancelOrder(orderId, progressingOrder.getExchangeId(), null,
                            new Timestamp(System.currentTimeMillis()), "");
                    cancelOrderRep.insertCancelOrder(cancelOrder);
                }

            }
            return true;
        } catch (Exception e) {
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
        }
        return false;
    }

    public boolean deleteProgressingOrder(int orderId) {
        String sql = "DELETE FROM progressing_order WHERE order_id = ?";
        return jdbcTemplate.update(sql, orderId) > 0;
    }
}
