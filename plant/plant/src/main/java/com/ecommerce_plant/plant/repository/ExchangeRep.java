package com.ecommerce_plant.plant.repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import com.ecommerce_plant.plant.mapping.modelmapping.ExchangeModelMap;
import com.ecommerce_plant.plant.model.Exchange;

/**
 * @author lemonftdev
 */
@Transactional(rollbackFor = { Exception.class, DataAccessException.class })
@Repository
public class ExchangeRep {
    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Autowired
    private ProgressingOrderRep progressingOrderRep;

    public List<Exchange> findAllExchanges() {
        String sql = "SELECT * FROM exchange";
        return jdbcTemplate.query(sql, BeanPropertyRowMapper.newInstance(Exchange.class));
    }

    public boolean insertExchange(ExchangeModelMap exchangeModelMap) {
        try {
            String sql = "INSERT INTO exchange (transaction, pay_type_id) VALUES (?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, exchangeModelMap.getExchange().getTransactionNo());
                ps.setInt(2, exchangeModelMap.getExchange().getPayTypeId());
                return ps;
            }, keyHolder);
            int exchangeId = keyHolder.getKey().intValue();
            progressingOrderRep.updateExchangeProgressingOrder(exchangeModelMap.getOrderId(), exchangeId);
            return true;
        } catch (Exception e) {
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
        }
        return false;
    }

    public boolean updateExchange(Exchange exchange) {
        String sql = "UPDATE exchange SET transaction = ?, pay_type_id = ? WHERE id = ?";
        return jdbcTemplate.update(sql, exchange.getTransactionNo(), exchange.getPayTypeId(), exchange.getId()) > 0;
    }

    public boolean deleteExchange(int id) {
        String sql = "DELETE FROM exchange WHERE id = ?";
        return jdbcTemplate.update(sql, id) > 0;
    }
}
