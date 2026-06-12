package com.bodega.demo.controller;

import com.bodega.demo.model.Usuario;
import com.bodega.demo.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios") // La URL base para los usuarios
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Método para ver todos los usuarios registrados (útil para el administrador)
    @GetMapping
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    // Método para registrar un nuevo cliente
    @PostMapping
    public Usuario registrarUsuario(@RequestBody Usuario usuario) {
        // Nota: Más adelante aquí agregaremos la librería Bcrypt para encriptar
        // la contraseña antes de guardarla. Por ahora, la guardaremos tal cual para probar.
        return usuarioRepository.save(usuario);
    }
}