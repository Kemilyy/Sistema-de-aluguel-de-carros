package br.com.driveon.service;

import br.com.driveon.model.Contrato;
import br.com.driveon.repository.ContratoCreditoRepository;
import br.com.driveon.repository.ContratoRepository;
import br.com.driveon.repository.PedidoRepository;
import br.com.driveon.repository.UsuarioRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ContratoService {

  private final ContratoRepository contratos;
  private final PedidoRepository pedidos;
  private final ContratoCreditoRepository creditos;
  private final UsuarioRepository usuarios;

  public ContratoService(
    ContratoRepository contratos,
    PedidoRepository pedidos,
    ContratoCreditoRepository creditos,
    UsuarioRepository usuarios
  ) {
    this.contratos = contratos;
    this.pedidos = pedidos;
    this.creditos = creditos;
    this.usuarios = usuarios;
  }

  public record ContratoResumo(
    Long id,
    Long pedidoId,
    Long clienteId,
    String clienteNome,
    String clienteEmail,
    String veiculo,
    LocalDate dataInicio,
    LocalDate dataFim,
    BigDecimal valorTotal,
    LocalDate dataContrato,
    String status
  ) {}

  @Transactional
  public List<ContratoResumo> listar(Long clienteId) {
    var pedidosComContrato =
      clienteId == null
        ? pedidos.findByStatusInOrderByIdDesc(List.of("APROVADO", "CONCLUIDO"))
        : pedidos.findByClienteIdAndStatusInOrderByIdDesc(
            clienteId,
            List.of("APROVADO", "CONCLUIDO")
          );
    for (var pedido : pedidosComContrato) {
      if (!contratos.existsByPedidoId(pedido.getId())) {
        var statusContrato = pedido.getStatus().equals("CONCLUIDO") ? "ATIVO" : "AGUARDANDO_BANCO";
        contratos.save(new Contrato(pedido, statusContrato));
      }
    }
    var encontrados =
      clienteId == null
        ? contratos.findAllByOrderByIdDesc()
        : contratos.findByPedidoClienteIdOrderByIdDesc(clienteId);
    return encontrados.stream().map(this::resumo).toList();
  }

  @Transactional
  public ContratoResumo executar(Long pedidoId, Long bancoId) {
    var pedido = pedidos
      .findById(pedidoId)
      .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado."));
    if (!pedido.getStatus().equals("APROVADO")) throw new IllegalArgumentException(
      "Apenas pedidos aprovados podem gerar contrato."
    );
    var contrato = contratos
      .findByPedidoId(pedidoId)
      .orElseGet(() -> new Contrato(pedido, "AGUARDANDO_BANCO"));
    if (contrato.getStatus().equals("ATIVO")) throw new IllegalArgumentException(
      "Este pedido já possui um contrato ativo."
    );
    var banco = usuarios
      .findById(bancoId)
      .orElseThrow(() -> new IllegalArgumentException("Agente bancário não encontrado."));
    pedido.setStatus("CONCLUIDO");
    pedidos.save(pedido);
    creditos.save(new br.com.driveon.model.ContratoCredito(pedido, banco, pedido.getValorTotal()));
    contrato.setStatus("ATIVO");
    return resumo(contratos.save(contrato));
  }

  private ContratoResumo resumo(Contrato contrato) {
    var pedido = contrato.getPedido();
    var cliente = pedido.getCliente();
    return new ContratoResumo(
      contrato.getId(),
      pedido.getId(),
      cliente.getId(),
      cliente.getNome(),
      cliente.getEmail(),
      pedido.getVeiculo(),
      pedido.getDataInicio(),
      pedido.getDataFim(),
      pedido.getValorTotal(),
      contrato.getDataContrato(),
      contrato.getStatus()
    );
  }
}
