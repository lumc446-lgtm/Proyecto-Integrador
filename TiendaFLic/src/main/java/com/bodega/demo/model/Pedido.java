package com.bodega.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pedidos")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación vital: Muchos pedidos le pueden pertenecer a UN mismo cliente
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "fecha_pedido", updatable = false)
    private LocalDateTime fechaPedido;

    @Column(name = "estado_pedido", nullable = false, length = 30)
    private String estadoPedido = "PENDIENTE";

    @Column(name = "metodo_pago", nullable = false, length = 20)
    private String metodoPago; // Aquí guardaremos "YAPE", "PLIN" o "EFECTIVO"

    @Column(nullable = false)
    private Double total;

    @PrePersist
    protected void onCreate() {
        this.fechaPedido = LocalDateTime.now();
    }

    public Pedido() {
    }

    // --- GETTERS Y SETTERS ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public LocalDateTime getFechaPedido() { return fechaPedido; }
    public void setFechaPedido(LocalDateTime fechaPedido) { this.fechaPedido = fechaPedido; }

    public String getEstadoPedido() { return estadoPedido; }
    public void setEstadoPedido(String estadoPedido) { this.estadoPedido = estadoPedido; }

    public String getMetodoPago() { return metodoPago; }
    public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }
}