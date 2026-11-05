package br.com.driveon.controller;

import br.com.driveon.model.Usuario;
import br.com.driveon.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clientes/me")
public class ClienteController {

  private final UsuarioService service;

  public ClienteController(UsuarioService service) {
    this.service = service;
  }

  public record Perfil(String nome, String cpf, String rg, String endereco, String profissao) {}

  @GetMapping
  public Map<String, Object> consultar(HttpSession session) {
    if (session.getAttribute("usuarioId") == null) throw new IllegalArgumentException(
      "Faça login para continuar."
    );
    if (!"CLIENTE".equals(session.getAttribute("tipo"))) throw new IllegalArgumentException(
      "Apenas clientes podem consultar este perfil."
    );
    Usuario u = service.consultar((Long) session.getAttribute("usuarioId"));
    return Map.of(
      "nome",
      u.getNome(),
      "email",
      u.getEmail(),
      "cpf",
      u.getCpf() == null ? "" : u.getCpf(),
      "rg",
      u.getRg() == null ? "" : u.getRg(),
      "endereco",
      u.getEndereco() == null ? "" : u.getEndereco(),
      "profissao",
      u.getProfissao() == null ? "" : u.getProfissao()
    );
  }

  @PutMapping
  public Map<String, Object> atualizar(@RequestBody Perfil perfil, HttpSession session) {
    if (session.getAttribute("usuarioId") == null) throw new IllegalArgumentException(
      "Faça login para continuar."
    );
    if (!"CLIENTE".equals(session.getAttribute("tipo"))) throw new IllegalArgumentException(
      "Apenas clientes podem editar este perfil."
    );
    Usuario u = service.atualizarCliente(
      (Long) session.getAttribute("usuarioId"),
      perfil.nome(),
      perfil.cpf(),
      perfil.rg(),
      perfil.endereco(),
      perfil.profissao()
    );
    return Map.of("id", u.getId(), "nome", u.getNome(), "email", u.getEmail(), "tipo", u.getTipo());
  }
}
