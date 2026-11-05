package br.com.driveon.repository;

import br.com.driveon.model.Contrato;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContratoRepository extends JpaRepository<Contrato, Long> {
  List<Contrato> findAllByOrderByIdDesc();
  List<Contrato> findByPedidoClienteIdOrderByIdDesc(Long clienteId);
  boolean existsByPedidoId(Long pedidoId);
}
