package br.com.driveon.config;

import br.com.driveon.repository.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class AuthSessionFilter extends OncePerRequestFilter {

  private final UsuarioRepository usuarioRepository;

  public AuthSessionFilter(UsuarioRepository usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  @Override
  protected void doFilterInternal(
    HttpServletRequest request,
    HttpServletResponse response,
    FilterChain filterChain
  ) throws ServletException, IOException {
    var session = request.getSession(true);
    if (session.getAttribute("usuarioId") == null) {
      String email = request.getHeader("X-User-Email");
      if (email != null && !email.isBlank()) {
        usuarioRepository.findByEmailIgnoreCase(email.trim()).ifPresent(user -> {
          session.setAttribute("usuarioId", user.getId());
          session.setAttribute("tipo", user.getTipo());
        });
      }
    }
    filterChain.doFilter(request, response);
  }
}
