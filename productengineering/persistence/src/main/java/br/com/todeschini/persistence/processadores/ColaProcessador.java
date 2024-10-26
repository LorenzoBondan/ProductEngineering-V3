package br.com.todeschini.persistence.processadores;

import br.com.todeschini.domain.business.publico.cola.DCola;
import br.com.todeschini.domain.business.publico.colausada.DColaUsada;
import br.com.todeschini.domain.business.publico.filho.DFilho;
import br.com.todeschini.domain.business.publico.material.DMaterial;
import br.com.todeschini.domain.business.publico.materialusado.DMaterialUsado;
import br.com.todeschini.domain.business.publico.materialusado.api.MaterialUsadoService;
import br.com.todeschini.persistence.publico.cola.ColaDomainToEntityAdapter;
import br.com.todeschini.persistence.publico.cola.ColaQueryRepository;
import org.springframework.stereotype.Component;

@Component
public class ColaProcessador implements MaterialProcessador {

    private final ColaQueryRepository queryRepository;
    private final ColaDomainToEntityAdapter adapter;
    private final MaterialUsadoService materialUsadoService;

    public ColaProcessador(ColaQueryRepository queryRepository, ColaDomainToEntityAdapter adapter, MaterialUsadoService materialUsadoService) {
        this.queryRepository = queryRepository;
        this.adapter = adapter;
        this.materialUsadoService = materialUsadoService;
    }

    @Override
    public void processarMaterial(DFilho filho, DMaterial material) {
        DCola cola = adapter.toDomain(queryRepository.findById(material.getCodigo()).get());
        incluirCola(filho, cola);
    }

    private void incluirCola(DFilho filho, DCola Cola) {
        DColaUsada colaUsada = new DColaUsada();
        colaUsada.setMaterial(Cola);
        colaUsada.setFilho(filho);
        colaUsada.setUnidadeMedida("KG");
        colaUsada.calcularQuantidadeLiquida();
        colaUsada.calcularQuantidadeBruta();
        colaUsada.calcularValor();
        DMaterialUsado materialUsado = materialUsadoService.incluir(colaUsada);
        filho.getMateriaisUsados().add(materialUsado);
    }
}
