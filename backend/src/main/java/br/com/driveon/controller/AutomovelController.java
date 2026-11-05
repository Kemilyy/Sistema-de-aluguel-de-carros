package br.com.driveon.controller;

import br.com.driveon.service.AutomovelService;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
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
    String tag
  ) {}

  @GetMapping
  public List<VeiculoResumo> listar() {
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
          automovel.getDestaque()
        )
      )
      .toList();
  }
}
