package br.com.driveon.repository;

import br.com.driveon.model.Automovel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface AutomovelRepository extends JpaRepository<Automovel, Long> {
  java.util.List<Automovel> findAllByOrderByIdAsc();
  boolean existsByPlaca(String placa);
  boolean existsByMatricula(String matricula);

  @Query("select a from Automovel a where lower(concat(concat(a.marca, ' '), a.modelo)) = lower(:nome)")
  Optional<Automovel> findByNomeCompleto(@Param("nome") String nome);
}
