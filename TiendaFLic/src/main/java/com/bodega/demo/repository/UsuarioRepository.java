package com.bodega.demo.repository;

import com.bodega.demo.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Esta línea mágica le enseña a Java a buscar a un usuario por su correo electrónico
    Optional<Usuario> findByEmail(String email);
}