package com.ecommerce_plant.plant.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce_plant.plant.model.Supplier;
import com.ecommerce_plant.plant.repository.SupplierRep;

@Service
public class SupplierService {

    @Autowired
    SupplierRep supplierRep;

    public List<Supplier> findAllSupplier() {
        return supplierRep.findAllSuppliers();
    }

    public boolean deleteSupplier(int id) {
        try {
            return supplierRep.deleteSupplier(id);
        } catch (Exception e) {
            return false;
        }
    }
}