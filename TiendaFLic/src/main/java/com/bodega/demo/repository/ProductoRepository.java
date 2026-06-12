package com.bodega.demo.repository; // Verifica que tu paquete sea este

import com.bodega.demo.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    // Solo con esta línea de código, Spring ya sabe cómo guardar, buscar y eliminar productos.
    // El "Long" es porque el ID de tu Producto es de tipo Long.
}