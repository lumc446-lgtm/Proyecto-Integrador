package com.bodega.demo.controller;

import com.bodega.demo.model.Categoria;
import com.bodega.demo.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias") // La URL para las categorías
public class CategoriaController {

    @Autowired
    private CategoriaRepository categoriaRepository;

    // Obtener todas las categorías
    @GetMapping
    public List<Categoria> listarCategorias() {
        return categoriaRepository.findAll();
    }

    // Guardar una nueva categoría
    @PostMapping
    public Categoria crearCategoria(@RequestBody Categoria categoria) {
        return categoriaRepository.save(categoria);
    }
}