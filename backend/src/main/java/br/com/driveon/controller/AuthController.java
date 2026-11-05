package br.com.driveon.controller;

import br.com.driveon.model.Usuario;
import br.com.driveon.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final UsuarioService service;

  public AuthController(UsuarioService service) {
    this.service = service;
  }

  public record AuthRequest(
    String nome,
    String email,
    String senha,
    String tipo,
    String cpf,
    String rg,
    String endereco,
    String profissao,
    List<UsuarioService.RendaDados> rendimentos
  ) {}

  @PostMapping("/cadastro")
  @ResponseStatus(HttpStatus.CREATED)
  public Map<String, Object> cadastrar(@RequestBody AuthRequest r, HttpSession session) {
    return usuario(
      service.cadastrar(
        r.nome(),
        r.email(),
        r.senha(),
        r.tipo() == null ? "CLIENTE" : r.tipo(),
        r.cpf(),
        r.rg(),
        r.endereco(),
        r.profissao(),
        r.rendimentos()
      ),
      session
    );
  }

  @PostMapping("/login")
  public Map<String, Object> login(@RequestBody AuthRequest r, HttpSession session) {
    return usuario(service.autenticar(r.email(), r.senha()), session);
  }

  @PostMapping("/logout")
  @ResponseStatus(org.springframework.http.HttpStatus.NO_CONTENT)
  public void logout(HttpSession session) {
    session.invalidate();
  }

  private Map<String, Object> usuario(Usuario u, HttpSession session) {
    session.setAttribute("usuarioId", u.getId());
    session.setAttribute("tipo", u.getTipo());
    return Map.of("id", u.getId(), "nome", u.getNome(), "email", u.getEmail(), "tipo", u.getTipo());
  }
}
