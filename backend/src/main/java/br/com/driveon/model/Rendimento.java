package br.com.driveon.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "rendimentos")
public class Rendimento {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "cliente_id")
  private Usuario cliente;

  @Column(nullable = false)
  private String empregador;

  @Column(nullable = false, precision = 12, scale = 2)
  private BigDecimal valor;

  protected Rendimento() {}

  public Rendimento(Usuario cliente, String empregador, BigDecimal valor) {
    this.cliente = cliente;
    this.empregador = empregador;
    this.valor = valor;
  }

  public Long getId() {
    return id;
  }

  @JsonIgnore
  public Usuario getCliente() {
    return cliente;
  }

  public String getEmpregador() {
    return empregador;
  }

  public BigDecimal getValor() {
    return valor;
  }
}
