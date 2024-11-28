package br.com.todeschini.persistence.publico.roteiro;

import br.com.todeschini.domain.metadata.QueryService;
import br.com.todeschini.persistence.entities.publico.Roteiro;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Collection;

@QueryService
public interface RoteiroQueryRepository extends PagingAndSortingRepository<Roteiro, Integer>, JpaSpecificationExecutor<Roteiro> {

    Collection<Roteiro> findByDescricaoIgnoreCase(String descricao); // usado para verificar registro duplicado

    Boolean existsByDescricaoIgnoreCase(String descricao);
}
