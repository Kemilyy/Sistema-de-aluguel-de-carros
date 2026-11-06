package br.com.driveon.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "pedidos_aluguel")
public class PedidoAluguel {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "cliente_id")
  private Usuario cliente;

  @ManyToOne
  @JoinColumn(name = "automovel_id")
  private Automovel automovel;

  @Column(nullable = false)
  private String veiculo;

  @Column(nullable = false)
  private LocalDate dataInicio;

  @Column(nullable = false)
  private LocalDate dataFim;

  @Column(nullable = false, precision = 12, scale = 2)
  private BigDecimal valorTotal;

  @Column(nullable = false)
  private String status = "PENDENTE";

  private String parecerFinanceiro;
  private String observacao;

  protected PedidoAluguel() {}

  public PedidoAluguel(
    Usuario cliente,
    Automovel automovel,
    LocalDate dataInicio,
    LocalDate dataFim,
    BigDecimal valorTotal
  ) {
    this.cliente = cliente;
    this.automovel = automovel;
    this.veiculo = automovel.getMarca() + " " + automovel.getModelo();
    this.dataInicio = dataInicio;
    this.dataFim = dataFim;
    this.valorTotal = valorTotal;
  }

  public Long getId() {
    return id;
  }

  public Usuario getCliente() {
    return cliente;
  }

  public Automovel getAutomovel() {
    return automovel;
  }

  public String getVeiculo() {
    return veiculo;
  }

  public LocalDate getDataInicio() {
    return dataInicio;
  }

  public LocalDate getDataFim() {
    return dataFim;
  }

  public BigDecimal getValorTotal() {
    return valorTotal;
  }

  public String getStatus() {
    return status;
  }

  public String getParecerFinanceiro() {
    return parecerFinanceiro;
  }

  public void setVeiculo(String v) {
    veiculo = v;
  }

  public void setDataInicio(LocalDate v) {
    dataInicio = v;
  }

  public void setDataFim(LocalDate v) {
    dataFim = v;
  }

  public void setValorTotal(BigDecimal v) {
    valorTotal = v;
  }

  public void setStatus(String v) {
    status = v;
  }

  public void setParecerFinanceiro(String v) {
    parecerFinanceiro = v;
  }

  public void setObservacao(String v) {
    observacao = v;
  }
}
