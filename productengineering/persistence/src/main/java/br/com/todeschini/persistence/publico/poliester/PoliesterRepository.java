package br.com.todeschini.persistence.publico.poliester;

import br.com.todeschini.persistence.entities.publico.Poliester;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface PoliesterRepository extends CrudRepository<Poliester, Integer> {

    @Query(nativeQuery = true, value = """
            SELECT criadopor FROM tb_material WHERE cdmaterial = :id
            """)
    String findCriadoporById(@Param("id") Integer id);

    @Query(nativeQuery = true, value = """
            SELECT criadoem FROM tb_material WHERE cdmaterial = :id
            """)
    LocalDateTime findCriadoemById(@Param("id") Integer id);
}
