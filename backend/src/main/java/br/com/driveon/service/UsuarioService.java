package br.com.driveon.service;

import br.com.driveon.model.Rendimento;
import br.com.driveon.model.Usuario;
import br.com.driveon.repository.RendimentoRepository;
import br.com.driveon.repository.ContratoCreditoRepository;
import br.com.driveon.repository.ContratoRepository;
import br.com.driveon.repository.PedidoRepository;
import br.com.driveon.repository.UsuarioRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

  private final UsuarioRepository usuarios;
  private final RendimentoRepository rendimentos;
  private final PasswordEncoder encoder;
  private final PedidoRepository pedidos;
  private final ContratoRepository contratos;
  private final ContratoCreditoRepository creditos;

  public UsuarioService(
    UsuarioRepository usuarios,
    RendimentoRepository rendimentos,
    PasswordEncoder encoder,
    PedidoRepository pedidos,
    ContratoRepository contratos,
    ContratoCreditoRepository creditos
  ) {
    this.usuarios = usuarios;
    this.rendimentos = rendimentos;
    this.encoder = encoder;
    this.pedidos = pedidos;
    this.contratos = contratos;
    this.creditos = creditos;
  }

  public record RendaDados(String empregador, BigDecimal valor) {}

  @Transactional
  public Usuario cadastrar(
    String nome,
    String email,
    String senha,
    String tipo,
    String cpf,
    String rg,
    String endereco,
    String profissao,
    List<RendaDados> rendas
  ) {
    if (usuarios.findByEmailIgnoreCase(email).isPresent()) throw new IllegalArgumentException(
      "Este e-mail já está cadastrado."
    );
    if (senha == null || senha.length() < 6) throw new IllegalArgumentException(
      "A senha precisa ter pelo menos 6 caracteres."
    );
    if (!List.of("CLIENTE", "AGENTE", "BANCO").contains(tipo)) throw new IllegalArgumentException(
      "Perfil de acesso inválido."
    );
    if (rendas != null && rendas.size() > 3) throw new IllegalArgumentException(
      "Informe no máximo três rendimentos."
    );
    if (
      rendas != null &&
      rendas
        .stream()
        .filter(r -> r != null && r.empregador() != null && !r.empregador().isBlank())
        .anyMatch(r -> r.valor() == null || r.valor().signum() < 0)
    ) throw new IllegalArgumentException("O valor do rendimento deve ser positivo.");
    var usuario = new Usuario(nome, email, encoder.encode(senha), tipo);
    usuario.setCpf(cpf);
    usuario.setRg(rg);
    usuario.setEndereco(endereco);
    usuario.setProfissao(profissao);
    usuario = usuarios.save(usuario);
    if (rendas != null) for (var renda : rendas) {
      if (
        renda != null && renda.empregador() != null && !renda.empregador().isBlank()
      ) rendimentos.save(new Rendimento(usuario, renda.empregador(), renda.valor()));
    }
    return usuario;
  }

  public Usuario autenticar(String email, String senha) {
    var usuario = usuarios
      .findByEmailIgnoreCase(email)
      .orElseThrow(() -> new IllegalArgumentException("E-mail ou senha inválidos."));
    if (!encoder.matches(senha, usuario.getSenha())) throw new IllegalArgumentException(
      "E-mail ou senha inválidos."
    );
    return usuario;
  }

  public Usuario consultar(Long id) {
    return usuarios
      .findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado."));
  }

  @Transactional
  public Usuario atualizarCliente(
    Long id,
    String nome,
    String cpf,
    String rg,
    String endereco,
    String profissao,
    List<RendaDados> rendas
  ) {
    var usuario = usuarios
      .findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado."));
    if (nome != null && !nome.isBlank()) usuario.setNome(nome);
    usuario.setCpf(cpf);
    usuario.setRg(rg);
    usuario.setEndereco(endereco);
    usuario.setProfissao(profissao);
    if (rendas != null) {
      validarRendimentos(rendas);
      rendimentos.deleteByClienteId(id);
      for (var renda : rendas) {
        if (renda != null && renda.empregador() != null && !renda.empregador().isBlank()) {
          rendimentos.save(new Rendimento(usuario, renda.empregador().trim(), renda.valor()));
        }
      }
    }
    return usuarios.save(usuario);
  }

  @Transactional
  public void excluirCliente(Long id) {
    var usuario = usuarios.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado."));
    if (!"CLIENTE".equals(usuario.getTipo())) throw new IllegalArgumentException(
      "Apenas clientes podem excluir a própria conta."
    );
    for (var pedido : pedidos.findByClienteIdOrderByIdDesc(id)) {
      creditos.deleteByPedidoId(pedido.getId());
      contratos.deleteByPedidoId(pedido.getId());
      pedidos.delete(pedido);
    }
    rendimentos.deleteByClienteId(id);
    usuarios.delete(usuario);
  }

  private void validarRendimentos(List<RendaDados> rendas) {
    if (rendas.size() > 3) throw new IllegalArgumentException("Informe no máximo três rendimentos.");
    if (rendas.stream()
      .filter(r -> r != null && r.empregador() != null && !r.empregador().isBlank())
      .anyMatch(r -> r.valor() == null || r.valor().signum() < 0)) {
      throw new IllegalArgumentException("O valor do rendimento deve ser positivo.");
    }
  }
}
