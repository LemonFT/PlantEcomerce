package com.ecommerce_plant.plant.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import com.ecommerce_plant.plant.mapping.modelmapping.RolePermissionMap;
import com.ecommerce_plant.plant.model.RolePermission;

/**
 * @author lemonftdev
 */
@Repository
@Transactional
public class RolePermissionRep {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @SuppressWarnings("deprecation")
    public List<RolePermission> findAllPermissionsByRoleId(int roleId) {
        System.err.println(roleId);
        String sql = "SELECT id_role as roleId, id_permission as permissionId FROM role_permission where id_role = ?";
        return jdbcTemplate.query(sql, new Object[] { roleId },
                BeanPropertyRowMapper.newInstance(RolePermission.class));
    }

    public boolean updatePermissionsByRole(RolePermissionMap rolePermissionMap) {
        int permissions[] = rolePermissionMap.getPermissions();
        try {
            String sqlDelete = "DELETE FROM role_permission WHERE id_role = ?";
            jdbcTemplate.update(sqlDelete, rolePermissionMap.getRoleId());
            String sqlInsert = "INSERT INTO role_permission (id_role, id_permission) VALUES (?, ?)";
            for (int i = 0; i < permissions.length; i++) {
                jdbcTemplate.update(sqlInsert, rolePermissionMap.getRoleId(), permissions[i]);
            }
            return true;
        } catch (Exception e) {
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
        }
        return false;
    }

}
