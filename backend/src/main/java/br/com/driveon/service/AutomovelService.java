package br.com.driveon.service;

import br.com.driveon.model.Automovel;
import br.com.driveon.repository.AutomovelRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Service;

@Service
public class AutomovelService implements ApplicationRunner {

  private final AutomovelRepository automoveis;

  public AutomovelService(AutomovelRepository automoveis) {
    this.automoveis = automoveis;
  }

  @Override
  public void run(ApplicationArguments args) {
    if (automoveis.count() > 0) return;

    automoveis.saveAll(
      List.of(
        new Automovel(
          2024,
          "Jeep",
          "Compass",
          "RNT1F01",
          "EMPRESA",
          "SUV · Automático",
          new BigDecimal("289.00"),
          "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?auto=format&fit=crop&w=900&q=85",
          "Mais escolhido"
        ),
        new Automovel(
          2024,
          "Hyundai",
          "Creta",
          "RNT2F02",
          "EMPRESA",
          "SUV · Automático",
          new BigDecimal("239.00"),
          "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=85",
          "Econômico"
        ),
        new Automovel(
          2023,
          "Honda",
          "Civic",
          "RNT3F03",
          "EMPRESA",
          "Sedan · Automático",
          new BigDecimal("319.00"),
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=85",
          "Premium"
        )
      )
    );
  }

  public List<Automovel> listar() {
    return automoveis.findAllByOrderByIdAsc();
  }
}
