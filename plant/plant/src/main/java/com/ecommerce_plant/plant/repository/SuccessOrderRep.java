package com.ecommerce_plant.plant.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ecommerce_plant.plant.mapping.modelmapping.CostOfGoodsSoldByYear;
import com.ecommerce_plant.plant.model.SuccessOrder;

/**
 * @author lemonftdev
 */
@Repository
public class SuccessOrderRep {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<SuccessOrder> findAllSuccessOrders() {
        String sql = "SELECT * FROM success_order";
        return jdbcTemplate.query(sql, BeanPropertyRowMapper.newInstance(SuccessOrder.class));
    }

    public boolean insertSuccessOrder(SuccessOrder successOrder) {
        String sql = "INSERT INTO success_order (order_id, exchange_id, delivery_time, complete_time) VALUES (?, ?, ?, ?)";
        return jdbcTemplate.update(sql, successOrder.getOrderId(), successOrder.getExchangeId(),
                successOrder.getDeliveryTime(), successOrder.getCompleteTime()) > 0;
    }

    public boolean updateSuccessOrder(SuccessOrder successOrder) {
        String sql = "UPDATE success_order SET exchange_id = ?, delivery_time = ?, complete_time = ? WHERE order_id = ?";
        return jdbcTemplate.update(sql, successOrder.getExchangeId(), successOrder.getDeliveryTime(),
                successOrder.getCompleteTime(), successOrder.getOrderId()) > 0;
    }

    public boolean deleteSuccessOrder(int orderId) {
        String sql = "DELETE FROM success_order WHERE order_id = ?";
        return jdbcTemplate.update(sql, orderId) > 0;
    }

    @SuppressWarnings("deprecation")
    public List<CostOfGoodsSoldByYear> getTotalRevenueFromSuccessOrder(int year) {
        String sql = "SELECT month(s.complete_time) as month, sum(o.total_pay) as cost " +
                " FROM success_order as s join `order`as o on s.order_id = o.id " +
                " where year(s.complete_time) = ? " +
                " group by month(s.complete_time), year(s.complete_time) ";
        return jdbcTemplate.query(sql, new Object[] { year },
                BeanPropertyRowMapper.newInstance(CostOfGoodsSoldByYear.class));
    }

    @SuppressWarnings("deprecation")
    public Double getTotalRevenueFromSuccessOrderAndCash(int year) {
        String sql = "SELECT SUM(o.total_pay) AS cost " +
                " FROM success_order AS s JOIN `order` AS o ON s.order_id = o.id " +
                " WHERE YEAR(s.complete_time) = ? AND o.pay_type_id = 1 " +
                " GROUP BY MONTH(s.complete_time), YEAR(s.complete_time) ";
        return jdbcTemplate.queryForObject(sql, new Object[] { year },
                (rs, rowNum) -> rs.getDouble("cost"));
    }

    @SuppressWarnings("deprecation")
    public Double getTotalRevenueFromSuccessOrderAndVnPay(int year) {
        String sql = "SELECT SUM(o.total_pay) AS cost " +
                " FROM success_order AS s JOIN `order` AS o ON s.order_id = o.id " +
                " WHERE YEAR(s.complete_time) = ? AND o.pay_type_id = 2 " +
                " GROUP BY MONTH(s.complete_time), YEAR(s.complete_time) ";
        return jdbcTemplate.queryForObject(sql, new Object[] { year },
                (rs, rowNum) -> rs.getDouble("cost"));
    }

}
