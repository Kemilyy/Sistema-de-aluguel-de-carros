package br.com.driveon.controller;

import br.com.driveon.service.AutomovelService;
import java.math.BigDecimal;
import java.util.List;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/automoveis")
public class AutomovelController {

  private final AutomovelService service;

  public AutomovelController(AutomovelService service) {
    this.service = service;
  }

  public record VeiculoResumo(
    Long id,
    String name,
    String type,
    BigDecimal price,
    String image,
    String tag,
    String category,
    String ownerType
  ) {}

  public record NovoVeiculo(
    String matricula,
    Integer ano,
    String marca,
    String modelo,
    String placa,
    String tipoProprietario,
    String categoria,
    BigDecimal precoDiaria,
    String imagem,
    String destaque
  ) {}

  @GetMapping
  public List<VeiculoResumo> listar(HttpSession session) {
    exigirLogin(session);
    return service
      .listar()
      .stream()
      .map(automovel ->
        new VeiculoResumo(
          automovel.getId(),
          automovel.getMarca() + " " + automovel.getModelo(),
          automovel.getCategoria(),
          automovel.getPrecoDiaria(),
          automovel.getImagem(),
          automovel.getDestaque(),
          automovel.getCategoria().contains("SUV")
            ? "SUV"
            : automovel.getCategoria().contains("Sedan")
              ? "Sedan"
              : automovel.getCategoria().contains("Hatch")
                ? "Hatch"
                : automovel.getCategoria().contains("Elétrico")
                  ? "Elétrico"
                  : automovel.getCategoria().contains("Picape")
                    ? "Picape"
                    : automovel.getCategoria().contains("Híbrido")
                      ? "Híbrido"
                      : automovel.getCategoria().contains("Premium")
                        ? "Premium"
                        : "Outro",
          automovel.getTipoProprietario()
        )
      )
      .toList();
  }

  private void exigirLogin(HttpSession session) {
    if (session.getAttribute("usuarioId") == null) throw new IllegalArgumentException(
      "Faça login para continuar."
    );
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public VeiculoResumo cadastrar(@RequestBody NovoVeiculo novo, HttpSession session) {
    Object role = session.getAttribute("tipo");
    if (session.getAttribute("usuarioId") == null) throw new IllegalArgumentException(
      "Faça login para continuar."
    );
    if (!"AGENTE".equals(role) && !"BANCO".equals(role)) throw new IllegalArgumentException(
      "Apenas agentes podem cadastrar veículos."
    );
    var automovel = service.cadastrar(
      novo.matricula(), novo.ano(), novo.marca(), novo.modelo(), novo.placa(),
      novo.tipoProprietario(), novo.categoria(), novo.precoDiaria(), novo.imagem(), novo.destaque()
    );
    return new VeiculoResumo(
      automovel.getId(), automovel.getMarca() + " " + automovel.getModelo(),
      automovel.getCategoria(), automovel.getPrecoDiaria(), automovel.getImagem(),
      automovel.getDestaque(), automovel.getCategoria(), automovel.getTipoProprietario()
    );
  }
}
