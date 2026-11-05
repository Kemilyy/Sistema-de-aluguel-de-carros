package br.com.driveon.repository;

import br.com.driveon.model.PedidoAluguel;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoRepository extends JpaRepository<PedidoAluguel, Long> {
  List<PedidoAluguel> findAllByOrderByIdDesc();
  List<PedidoAluguel> findByClienteIdOrderByIdDesc(Long clienteId);
}
