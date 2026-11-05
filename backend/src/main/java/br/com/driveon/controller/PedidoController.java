package br.com.driveon.controller;

import br.com.driveon.model.PedidoAluguel;
import br.com.driveon.service.PedidoService;
import jakarta.servlet.http.HttpSession;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

  private final PedidoService service;

  public PedidoController(PedidoService service) {
    this.service = service;
  }

  public record NovoPedido(
    Long clienteId,
    String veiculo,
    LocalDate dataInicio,
    LocalDate dataFim,
    BigDecimal valorTotal
  ) {}

  public record Atualizacao(String status, String parecerFinanceiro, String observacao) {}

  @GetMapping
  public List<PedidoAluguel> listar(HttpSession session) {
    Long id = usuarioId(session);
    String tipo = tipo(session);
    return tipo.equals("CLIENTE") ? service.listar(id) : service.listar(null);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public PedidoAluguel criar(@RequestBody NovoPedido r, HttpSession session) {
    exigirTipo(session, "CLIENTE");
    return service.criar(
      usuarioId(session),
      r.veiculo(),
      r.dataInicio(),
      r.dataFim(),
      r.valorTotal()
    );
  }

  @PatchMapping("/{id}")
  public PedidoAluguel atualizar(
    @PathVariable Long id,
    @RequestBody Atualizacao r,
    HttpSession session
  ) {
    if (tipo(session).equals("CLIENTE")) {
      if ("CANCELADO".equals(r.status())) {
        service.cancelar(id, usuarioId(session));
        return service
          .listar(usuarioId(session))
          .stream()
          .filter(p -> p.getId().equals(id))
          .findFirst()
          .orElseThrow();
      }
      return service.editarCliente(id, usuarioId(session), r.observacao());
    }
    return service.atualizar(id, r.status(), r.parecerFinanceiro());
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void cancelar(@PathVariable Long id, HttpSession session) {
    exigirTipo(session, "CLIENTE");
    service.cancelar(id, usuarioId(session));
  }

  private Long usuarioId(HttpSession s) {
    Object id = s.getAttribute("usuarioId");
    if (id == null) throw new IllegalArgumentException("Faça login para continuar.");
    return (Long) id;
  }

  private String tipo(HttpSession s) {
    usuarioId(s);
    return (String) s.getAttribute("tipo");
  }

  private void exigirTipo(HttpSession s, String esperado) {
    if (!tipo(s).equals(esperado)) throw new IllegalArgumentException(
      "Seu perfil não tem permissão para esta operação."
    );
  }
}
