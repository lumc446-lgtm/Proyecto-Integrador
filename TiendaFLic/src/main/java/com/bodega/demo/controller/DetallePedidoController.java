package com.bodega.demo.controller;

import com.bodega.demo.model.DetallePedido;
import com.bodega.demo.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/detalles")
public class DetallePedidoController {

    // ¡Ojo aquí! Ya no inyectamos el Repository, ahora inyectamos el Service
    @Autowired
    private PedidoService pedidoService;

    @PostMapping
    public DetallePedido agregarDetalle(@RequestBody DetallePedido detalle) {
        // Llamamos a nuestra regla de negocio
        return pedidoService.agregarDetalleYDescontarStock(detalle);
    }
}