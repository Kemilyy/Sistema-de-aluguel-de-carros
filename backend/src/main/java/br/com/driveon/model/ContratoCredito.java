package br.com.driveon.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "contratos_credito")
public class ContratoCredito {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne(optional = false)
  @JoinColumn(name = "pedido_id", unique = true)
  private PedidoAluguel pedido;

  @ManyToOne(optional = false)
  @JoinColumn(name = "banco_id")
  private Usuario banco;

  @Column(nullable = false, precision = 12, scale = 2)
  private BigDecimal valorCredito;

  @Column(nullable = false)
  private LocalDate dataConcessao = LocalDate.now();

  protected ContratoCredito() {}

  public ContratoCredito(PedidoAluguel pedido, Usuario banco, BigDecimal valorCredito) {
    this.pedido = pedido;
    this.banco = banco;
    this.valorCredito = valorCredito;
  }

  public Long getId() {
    return id;
  }

  public PedidoAluguel getPedido() {
    return pedido;
  }

  public Usuario getBanco() {
    return banco;
  }

  public BigDecimal getValorCredito() {
    return valorCredito;
  }

  public LocalDate getDataConcessao() {
    return dataConcessao;
  }
}
