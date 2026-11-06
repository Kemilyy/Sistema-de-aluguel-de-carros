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
    var frota = List.of(
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
      ),
      new Automovel(
        2024,
        "Toyota",
        "Corolla",
        "RNT4F04",
        "EMPRESA",
        "Sedan · Híbrido Flex",
        new BigDecimal("299.00"),
        "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=900&q=85",
        "Híbrido"
      ),
      new Automovel(
        2024,
        "Volkswagen",
        "Nivus",
        "RNT5F05",
        "EMPRESA",
        "SUV Coupé · Turbo Flex",
        new BigDecimal("229.00"),
        "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=85",
        "Moderno"
      ),
      new Automovel(
        2024,
        "Fiat",
        "Pulse",
        "RNT6F06",
        "EMPRESA",
        "Crossover · Turbo Flex",
        new BigDecimal("199.00"),
        "https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=900&q=85",
        "Custo-benefício"
      ),
      new Automovel(
        2023,
        "Jeep",
        "Renegade",
        "RNT7F07",
        "EMPRESA",
        "SUV · 4x4 Turbo Flex",
        new BigDecimal("259.00"),
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=85",
        "Aventura"
      ),
      new Automovel(
        2024,
        "BMW",
        "320i",
        "RNT8F08",
        "EMPRESA",
        "Sedan Premium · TwinPower",
        new BigDecimal("489.00"),
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=85",
        "Luxo"
      ),
      new Automovel(
        2024,
        "Chevrolet",
        "Tracker",
        "RNT9F09",
        "EMPRESA",
        "SUV · Turbo Automático",
        new BigDecimal("249.00"),
        "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=900&q=85",
        "Familiar"
      ),
      new Automovel(
        2024,
        "Peugeot",
        "208",
        "RNT0F10",
        "EMPRESA",
        "Hatch · Turbo Automático",
        new BigDecimal("189.00"),
        "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=900&q=85",
        "Compacto"
      ),
      new Automovel(
        2025,
        "BYD",
        "Song Plus",
        "RNT1F11",
        "EMPRESA",
        "SUV · Híbrido Plug-in DM-i",
        new BigDecimal("359.00"),
        "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=85",
        "Sustentável"
      ),
      new Automovel(
        2024,
        "Ford",
        "Bronco Sport",
        "RNT2F12",
        "EMPRESA",
        "SUV · 4x4 EcoBoost",
        new BigDecimal("389.00"),
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=85",
        "Performance"
      ),
      new Automovel(
        2024,
        "Volkswagen",
        "T-Cross",
        "RNT3F13",
        "EMPRESA",
        "SUV · 200 TSI Automático",
        new BigDecimal("245.00"),
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=85",
        "Popular"
      ),
      new Automovel(
        2024,
        "Toyota",
        "Hilux SRX",
        "RNT4F14",
        "EMPRESA",
        "Picape 4x4 · Diesel Turbo",
        new BigDecimal("469.00"),
        "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=900&q=85",
        "Robustez"
      ),
      new Automovel(
        2024,
        "Chevrolet",
        "Onix Premier",
        "RNT5F15",
        "EMPRESA",
        "Hatch · Turbo Automático",
        new BigDecimal("179.00"),
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=85",
        "Super Econômico"
      ),
      new Automovel(
        2024,
        "Volvo",
        "XC60 Recharge",
        "RNT6F16",
        "EMPRESA",
        "SUV Híbrido Plug-in · AWD",
        new BigDecimal("589.00"),
        "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=900&q=85",
        "Segurança Máxima"
      ),
      new Automovel(
        2025,
        "BYD",
        "Dolphin",
        "RNT7F17",
        "EMPRESA",
        "100% Elétrico · EV Compacto",
        new BigDecimal("269.00"),
        "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=900&q=85",
        "100% Elétrico"
      ),
      new Automovel(
        2024,
        "Audi",
        "A4 S-Line",
        "RNT8F18",
        "EMPRESA",
        "Sedan Executivo · TFSI S-Tronic",
        new BigDecimal("519.00"),
        "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=900&q=85",
        "Design Alemão"
      ),
      new Automovel(
        2024,
        "Fiat",
        "Fastback",
        "RNT9F19",
        "EMPRESA",
        "SUV Coupé · Turbo Flex",
        new BigDecimal("235.00"),
        "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=900&q=85",
        "Porta-malas 600L"
      ),
      new Automovel(
        2024,
        "Hyundai",
        "HB20 Platinum",
        "RNT0F20",
        "EMPRESA",
        "Hatch · 1.0 Turbo GDI",
        new BigDecimal("185.00"),
        "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=900&q=85",
        "Ágil na Cidade"
      ),
      new Automovel(
        2024,
        "Nissan",
        "Kicks Exclusive",
        "RNT1F21",
        "EMPRESA",
        "SUV · Câmbio Xtronic CVT",
        new BigDecimal("225.00"),
        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=900&q=85",
        "Conforto"
      ),
      new Automovel(
        2024,
        "Mercedes-Benz",
        "C300",
        "RNT2F22",
        "EMPRESA",
        "Sedan Luxo · 9G-Tronic AMG Line",
        new BigDecimal("629.00"),
        "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=900&q=85",
        "Sofisticação"
      ),
      new Automovel(
        2024,
        "Renault",
        "Duster Iconic",
        "RNT3F23",
        "EMPRESA",
        "SUV Robusto · 1.3 Turbo TCe",
        new BigDecimal("239.00"),
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=85",
        "Espaço Interno"
      ),
      new Automovel(
        2024,
        "Porsche",
        "Macan",
        "RNT4F24",
        "EMPRESA",
        "SUV Esportivo · PDK 2.0 Turbo",
        new BigDecimal("799.00"),
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=85",
        "Superesportivo"
      )
    );

    for (var auto : frota) {
      if (!automoveis.existsByPlaca(auto.getPlaca())) {
        automoveis.save(auto);
      }
    }
  }

  public List<Automovel> listar() {
    return automoveis.findAllByOrderByIdAsc();
  }

  public Automovel cadastrar(
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
  ) {
    if (ano == null || ano < 1886) throw new IllegalArgumentException("Informe um ano válido para o veículo.");
    if (marca == null || marca.isBlank() || modelo == null || modelo.isBlank() || placa == null || placa.isBlank()) {
      throw new IllegalArgumentException("Marca, modelo e placa são obrigatórios.");
    }
    if (automoveis.existsByPlaca(placa.trim())) throw new IllegalArgumentException("Esta placa já está cadastrada.");
    if (matricula != null && !matricula.isBlank() && automoveis.existsByMatricula(matricula.trim())) {
      throw new IllegalArgumentException("Esta matrícula já está cadastrada.");
    }
    var proprietario = tipoProprietario == null ? "EMPRESA" : tipoProprietario.trim().toUpperCase();
    if (!List.of("CLIENTE", "EMPRESA", "BANCO").contains(proprietario)) {
      throw new IllegalArgumentException("Tipo de proprietário inválido.");
    }
    if (precoDiaria == null || precoDiaria.signum() < 0) throw new IllegalArgumentException(
      "Informe um preço diário válido."
    );
    var vehicle = new Automovel(
      ano, marca.trim(), modelo.trim(), placa.trim(), proprietario,
      categoria == null || categoria.isBlank() ? "Veículo" : categoria.trim(),
      precoDiaria, imagem == null ? "" : imagem.trim(), destaque == null ? "" : destaque.trim()
    );
    return automoveis.save(vehicle);
  }
}
