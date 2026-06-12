package com.bodega.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "detalle_pedidos")
public class DetallePedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Conexión con la factura general (El Pedido)
    @ManyToOne
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;

    // Conexión con el ítem físico (El Producto)
    @ManyToOne
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @Column(nullable = false)
    private Integer cantidad;

    // El precio congelado al momento exacto de la compra
    @Column(name = "precio_unitario", nullable = false)
    private Double precioUnitario;

    public DetallePedido() {
    }

    // --- GETTERS Y SETTERS ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Pedido getPedido() { return pedido; }
    public void setPedido(Pedido pedido) { this.pedido = pedido; }

    public Producto getProducto() { return producto; }
    public void setProducto(Producto producto) { this.producto = producto; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public Double getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(Double precioUnitario) { this.precioUnitario = precioUnitario; }
}