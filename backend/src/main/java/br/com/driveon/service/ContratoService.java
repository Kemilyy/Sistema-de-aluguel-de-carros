package br.com.driveon.service;

import br.com.driveon.model.Contrato;
import br.com.driveon.repository.ContratoCreditoRepository;
import br.com.driveon.repository.ContratoRepository;
import br.com.driveon.repository.PedidoRepository;
import br.com.driveon.repository.UsuarioRepository;
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

  public List<Contrato> listar(Long clienteId) {
    return clienteId == null
      ? contratos.findAllByOrderByIdDesc()
      : contratos.findByPedidoClienteIdOrderByIdDesc(clienteId);
  }

  @Transactional
  public Contrato executar(Long pedidoId, Long bancoId) {
    var pedido = pedidos
      .findById(pedidoId)
      .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado."));
    if (!pedido.getStatus().equals("APROVADO")) throw new IllegalArgumentException(
      "Apenas pedidos aprovados podem gerar contrato."
    );
    if (contratos.existsByPedidoId(pedidoId)) throw new IllegalArgumentException(
      "Este pedido já possui contrato."
    );
    var banco = usuarios
      .findById(bancoId)
      .orElseThrow(() -> new IllegalArgumentException("Agente bancário não encontrado."));
    pedido.setStatus("CONCLUIDO");
    pedidos.save(pedido);
    creditos.save(new br.com.driveon.model.ContratoCredito(pedido, banco, pedido.getValorTotal()));
    return contratos.save(new Contrato(pedido));
  }
}
