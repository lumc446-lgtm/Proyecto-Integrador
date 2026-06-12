package com.bodega.demo.controller;

import com.bodega.demo.model.Producto;
import com.bodega.demo.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos") // Esta será la URL principal para los productos
public class ProductoController {

    @Autowired
    private ProductoRepository productoRepository;

    // 1. Método para OBTENER todos los productos (GET)
    @GetMapping
    public List<Producto> listarProductos() {
        return productoRepository.findAll();
    }

    // 2. Método para GUARDAR un nuevo producto (POST)
    @PostMapping
    public Producto crearProducto(@RequestBody Producto producto) {
        return productoRepository.save(producto);
    }
}