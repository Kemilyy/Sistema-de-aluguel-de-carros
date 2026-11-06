package br.com.driveon.controller;

import br.com.driveon.service.ContratoService;
import jakarta.servlet.http.HttpSession;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contratos")
public class ContratoController {

  private final ContratoService service;

  public ContratoController(ContratoService service) {
    this.service = service;
  }

  @GetMapping
  public List<ContratoService.ContratoResumo> listar(HttpSession session) {
    exigirLogin(session);
    return "CLIENTE".equals(session.getAttribute("tipo"))
      ? service.listar((Long) session.getAttribute("usuarioId"))
      : service.listar(null);
  }

  @PostMapping("/pedido/{pedidoId}/executar")
  @ResponseStatus(HttpStatus.CREATED)
  public ContratoService.ContratoResumo executar(@PathVariable Long pedidoId, HttpSession session) {
    if (!"BANCO".equals(session.getAttribute("tipo"))) throw new IllegalArgumentException(
      "Apenas agentes bancários podem executar o contrato."
    );
    return service.executar(pedidoId, (Long) session.getAttribute("usuarioId"));
  }

  private void exigirLogin(HttpSession session) {
    if (session.getAttribute("usuarioId") == null) throw new IllegalArgumentException(
      "Faça login para continuar."
    );
  }
}
