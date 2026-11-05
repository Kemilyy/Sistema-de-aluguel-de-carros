package br.com.driveon.repository;

import br.com.driveon.model.Automovel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AutomovelRepository extends JpaRepository<Automovel, Long> {
  java.util.List<Automovel> findAllByOrderByIdAsc();
}
