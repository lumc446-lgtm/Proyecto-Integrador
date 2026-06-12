package com.bodega.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "codigo_barras", unique = true, length = 50)
    private String codigoBarras;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(length = 100)
    private String marca;

    @Column(nullable = false)
    private Double precio;

    @Column(name = "stock_actual", nullable = false)
    private Integer stockActual = 0;

    @Column(name = "stock_minimo", nullable = false)
    private Integer stockMinimo = 5;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(name = "url_imagen")
    private String urlImagen;

    // Constructores vacíos exigidos por JPA
    public Producto() {
    }

    // A partir de aquí, en IntelliJ puedes generar los Getters y Setters automáticamente
    // Haciendo clic derecho > Generate... > Getter and Setter > Seleccionar todos.

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCodigoBarras() { return codigoBarras; }
    public void setCodigoBarras(String codigoBarras) { this.codigoBarras = codigoBarras; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }

    public Double getPrecio() { return precio; }
    public void setPrecio(Double precio) { this.precio = precio; }

    public Integer getStockActual() { return stockActual; }
    public void setStockActual(Integer stockActual) { this.stockActual = stockActual; }

    public Integer getStockMinimo() { return stockMinimo; }
    public void setStockMinimo(Integer stockMinimo) { this.stockMinimo = stockMinimo; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }

    public String getUrlImagen() { return urlImagen; }
    public void setUrlImagen(String urlImagen) { this.urlImagen = urlImagen; }

    @ManyToOne // Significa: "Muchos productos pueden pertenecer a Una categoría"
    @JoinColumn(name = "categoria_id") // Así se llamará la columna de la llave foránea en PostgreSQL
    private Categoria categoria;

    // ¡No olvides agregar su Getter y Setter al final del archivo!
    public Categoria getCategoria() { return categoria; }
    public void setCategoria(Categoria categoria) { this.categoria = categoria; }
}