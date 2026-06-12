package com.bodega.demo.controller;

import com.bodega.demo.model.Pedido;
import com.bodega.demo.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    @Autowired
    private PedidoRepository pedidoRepository;

    @GetMapping
    public List<Pedido> listarPedidos() {
        return pedidoRepository.findAll();
    }

    @PostMapping
    public Pedido crearPedido(@RequestBody Pedido pedido) {
        return pedidoRepository.save(pedido);
    }
}