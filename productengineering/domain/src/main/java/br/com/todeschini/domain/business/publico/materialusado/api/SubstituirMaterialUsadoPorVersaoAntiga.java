package br.com.todeschini.domain.business.publico.materialusado.api;

import br.com.todeschini.domain.business.publico.materialusado.DMaterialUsado;

public interface SubstituirMaterialUsadoPorVersaoAntiga {

    DMaterialUsado substituirPorVersaoAntiga(Integer id, Integer versionId);
}
