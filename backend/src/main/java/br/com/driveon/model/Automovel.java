package br.com.driveon.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "automoveis")
public class Automovel {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(unique = true)
  private String matricula;

  @Column(nullable = false)
  private Integer ano;

  @Column(nullable = false)
  private String marca;

  @Column(nullable = false)
  private String modelo;

  @Column(nullable = false, unique = true)
  private String placa;

  @Column(nullable = false)
  private String tipoProprietario = "EMPRESA";

  @Column(nullable = false)
  private String categoria;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal precoDiaria;

  @Column(nullable = false, length = 500)
  private String imagem;

  @Column(nullable = false)
  private String destaque;

  protected Automovel() {}

  public Automovel(
    Integer ano,
    String marca,
    String modelo,
    String placa,
    String tipoProprietario,
    String categoria,
    BigDecimal precoDiaria,
    String imagem,
    String destaque
  ) {
    this.ano = ano;
    this.marca = marca;
    this.modelo = modelo;
    this.placa = placa;
    this.tipoProprietario = tipoProprietario;
    this.categoria = categoria;
    this.precoDiaria = precoDiaria;
    this.imagem = imagem;
    this.destaque = destaque;
  }

  public Long getId() {
    return id;
  }

  public String getMatricula() {
    return matricula;
  }

  public Integer getAno() {
    return ano;
  }

  public String getMarca() {
    return marca;
  }

  public String getModelo() {
    return modelo;
  }

  public String getPlaca() {
    return placa;
  }

  public String getTipoProprietario() {
    return tipoProprietario;
  }

  public String getCategoria() {
    return categoria;
  }

  public BigDecimal getPrecoDiaria() {
    return precoDiaria;
  }

  public String getImagem() {
    return imagem;
  }

  public String getDestaque() {
    return destaque;
  }
}
