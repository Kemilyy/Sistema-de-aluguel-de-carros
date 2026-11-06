package br.com.driveon.repository;

import br.com.driveon.model.PedidoAluguel;
import java.util.List;
import java.time.LocalDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PedidoRepository extends JpaRepository<PedidoAluguel, Long> {
  List<PedidoAluguel> findAllByOrderByIdDesc();
  List<PedidoAluguel> findByClienteIdOrderByIdDesc(Long clienteId);
  List<PedidoAluguel> findByStatusInOrderByIdDesc(List<String> statuses);
  List<PedidoAluguel> findByClienteIdAndStatusInOrderByIdDesc(
    Long clienteId,
    List<String> statuses
  );

  @Query("select p from PedidoAluguel p where lower(p.veiculo) = lower(:veiculo) and p.status not in ('CANCELADO', 'REPROVADO') and p.dataInicio <= :fim and p.dataFim >= :inicio order by p.dataInicio")
  List<PedidoAluguel> encontrarConflitos(
    @Param("veiculo") String veiculo,
    @Param("inicio") LocalDate inicio,
    @Param("fim") LocalDate fim
  );

  @Query("select p from PedidoAluguel p where lower(p.veiculo) = lower(:veiculo) and p.status not in ('CANCELADO', 'REPROVADO') order by p.dataInicio")
  List<PedidoAluguel> listarDatasIndisponiveis(@Param("veiculo") String veiculo);
}
