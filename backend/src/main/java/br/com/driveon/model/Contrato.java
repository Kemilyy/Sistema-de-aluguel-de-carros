package br.com.driveon.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "contratos")
public class Contrato {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne(optional = false)
  @JoinColumn(name = "pedido_id", unique = true)
  private PedidoAluguel pedido;

  @Column(nullable = false)
  private LocalDate dataContrato = LocalDate.now();

  @Column(nullable = false)
  private String status = "AGUARDANDO_BANCO";

  protected Contrato() {}

  public Contrato(PedidoAluguel pedido) {
    this.pedido = pedido;
  }

  public Contrato(PedidoAluguel pedido, String status) {
    this.pedido = pedido;
    this.status = status;
  }

  public Long getId() {
    return id;
  }

  public PedidoAluguel getPedido() {
    return pedido;
  }

  public LocalDate getDataContrato() {
    return dataContrato;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }
}
