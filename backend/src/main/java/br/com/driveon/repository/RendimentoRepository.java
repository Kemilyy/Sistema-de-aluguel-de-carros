package br.com.driveon.repository;

import br.com.driveon.model.Rendimento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RendimentoRepository extends JpaRepository<Rendimento, Long> {
  long countByClienteId(Long clienteId);
}
