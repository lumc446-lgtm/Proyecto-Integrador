package com.bodega.demo.service;

import com.bodega.demo.model.DetallePedido;
import com.bodega.demo.model.Producto;
import com.bodega.demo.repository.DetallePedidoRepository;
import com.bodega.demo.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PedidoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private DetallePedidoRepository detallePedidoRepository;

    // Esta función centraliza la lógica de negocio de la venta
    public DetallePedido agregarDetalleYDescontarStock(DetallePedido detalle) {

        // 1. Extraemos el producto de la base de datos usando su ID
        Producto productoDB = productoRepository.findById(detalle.getProducto().getId())
                .orElseThrow(() -> new RuntimeException("¡Error! Producto no encontrado"));

        // 2. Regla de negocio: ¿Hay stock suficiente?
        if (productoDB.getStockActual() < detalle.getCantidad()) {
            throw new RuntimeException("Stock insuficiente para: " + productoDB.getNombre());
        }

        // 3. Matemática simple: Descontamos el stock
        int nuevoStock = productoDB.getStockActual() - detalle.getCantidad();
        productoDB.setStockActual(nuevoStock);

        // Guardamos el producto con su nuevo stock
        productoRepository.save(productoDB);

        // 4. Finalmente, guardamos el detalle de la compra en la factura
        return detallePedidoRepository.save(detalle);
    }
}