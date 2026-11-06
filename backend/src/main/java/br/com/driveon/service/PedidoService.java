package br.com.driveon.service;

import br.com.driveon.model.Contrato;
import br.com.driveon.model.PedidoAluguel;
import br.com.driveon.repository.ContratoRepository;
import br.com.driveon.repository.PedidoRepository;
import br.com.driveon.repository.UsuarioRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PedidoService {

  private final PedidoRepository pedidos;
  private final ContratoRepository contratos;
  private final UsuarioRepository usuarios;

  public PedidoService(
    PedidoRepository pedidos,
    ContratoRepository contratos,
    UsuarioRepository usuarios
  ) {
    this.pedidos = pedidos;
    this.contratos = contratos;
    this.usuarios = usuarios;
  }

  public List<PedidoAluguel> listar(Long clienteId) {
    return clienteId == null
      ? pedidos.findAllByOrderByIdDesc()
      : pedidos.findByClienteIdOrderByIdDesc(clienteId);
  }

  public PedidoAluguel criar(
    Long clienteId,
    String veiculo,
    LocalDate inicio,
    LocalDate fim,
    BigDecimal valor
  ) {
    if (inicio == null || fim == null) throw new IllegalArgumentException(
      "Informe as datas de retirada e devolução."
    );
    if (!fim.isAfter(inicio)) throw new IllegalArgumentException(
      "A devolução deve ocorrer após a retirada."
    );
    if (!pedidos.encontrarConflitos(veiculo, inicio, fim).isEmpty()) throw new IllegalArgumentException(
      "Este veículo já está reservado para uma ou mais datas selecionadas."
    );
    var cliente = usuarios
      .findById(clienteId)
      .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado."));
    return pedidos.save(new PedidoAluguel(cliente, veiculo, inicio, fim, valor));
  }

  public List<PedidoAluguel> datasIndisponiveis(String veiculo) {
    if (veiculo == null || veiculo.isBlank()) throw new IllegalArgumentException(
      "Informe o veículo para consultar as datas."
    );
    return pedidos.listarDatasIndisponiveis(veiculo.trim());
  }

  @Transactional
  public PedidoAluguel atualizar(Long id, String status, String parecer) {
    var pedido = pedidos
      .findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado."));
    if (status != null) pedido.setStatus(status);
    if (parecer != null) pedido.setParecerFinanceiro(parecer);
    pedido = pedidos.save(pedido);
    if ("APROVADO".equals(status) && !contratos.existsByPedidoId(id)) {
      contratos.save(new Contrato(pedido, "AGUARDANDO_BANCO"));
    }
    return pedido;
  }

  public PedidoAluguel editarCliente(Long id, Long clienteId, String observacao) {
    var pedido = pedidos
      .findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado."));
    if (!pedido.getCliente().getId().equals(clienteId)) throw new IllegalArgumentException(
      "Você só pode modificar seus próprios pedidos."
    );
    if (
      !pedido.getStatus().equals("PENDENTE") && !pedido.getStatus().equals("EM_ANALISE")
    ) throw new IllegalArgumentException("Este pedido não pode mais ser modificado.");
    pedido.setObservacao(observacao);
    return pedidos.save(pedido);
  }

  public void cancelar(Long id, Long clienteId) {
    var pedido = pedidos
      .findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado."));
    if (!pedido.getCliente().getId().equals(clienteId)) throw new IllegalArgumentException(
      "Você só pode cancelar seus próprios pedidos."
    );
    if (
      !pedido.getStatus().equals("PENDENTE") && !pedido.getStatus().equals("EM_ANALISE")
    ) throw new IllegalArgumentException("Este pedido não pode mais ser cancelado.");
    pedido.setStatus("CANCELADO");
    pedidos.save(pedido);
  }
}
