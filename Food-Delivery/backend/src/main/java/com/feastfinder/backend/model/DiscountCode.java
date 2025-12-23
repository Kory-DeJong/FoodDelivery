package com.feastfinder.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "discount_codes")
public class DiscountCode {
    public enum Type { PERCENT, FLAT }
    @Id
    private String code;
    @Enumerated(EnumType.STRING)
    @Column(name = "code_type")
    private Type type;
    @Column(name = "amount")
    private double value;
    private boolean active = true;

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public Type getType() { return type; }
    public void setType(Type type) { this.type = type; }
    public double getValue() { return value; }
    public void setValue(double value) { this.value = value; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
