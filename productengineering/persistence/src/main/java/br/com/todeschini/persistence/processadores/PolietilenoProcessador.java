package br.com.todeschini.persistence.processadores;

import br.com.todeschini.domain.business.publico.filho.DFilho;
import br.com.todeschini.domain.business.publico.material.DMaterial;
import br.com.todeschini.domain.business.publico.materialusado.DMaterialUsado;
import br.com.todeschini.domain.business.publico.materialusado.api.MaterialUsadoService;
import br.com.todeschini.domain.business.publico.polietileno.DPolietileno;
import br.com.todeschini.domain.business.publico.polietilenousado.DPolietilenoUsado;
import br.com.todeschini.persistence.publico.polietileno.PolietilenoDomainToEntityAdapter;
import br.com.todeschini.persistence.publico.polietileno.PolietilenoQueryRepository;
import org.springframework.stereotype.Component;

@Component
public class PolietilenoProcessador implements MaterialProcessador {

    private final PolietilenoQueryRepository queryRepository;
    private final PolietilenoDomainToEntityAdapter adapter;
    private final MaterialUsadoService materialUsadoService;

    public PolietilenoProcessador(PolietilenoQueryRepository queryRepository, PolietilenoDomainToEntityAdapter adapter, MaterialUsadoService materialUsadoService) {
        this.queryRepository = queryRepository;
        this.adapter = adapter;
        this.materialUsadoService = materialUsadoService;
    }

    @Override
    public void processarMaterial(DFilho filho, DMaterial material) {
        DPolietileno Polietileno = adapter.toDomain(queryRepository.findById(material.getCodigo()).get());
        incluirPolietileno(filho, Polietileno);
    }

    private void incluirPolietileno(DFilho filho, DPolietileno Polietileno) {
        DPolietilenoUsado PolietilenoUsado = new DPolietilenoUsado();
        PolietilenoUsado.setMaterial(Polietileno);
        PolietilenoUsado.setFilho(filho);
        PolietilenoUsado.setUnidadeMedida("M");
        PolietilenoUsado.calcularQuantidadeLiquida();
        PolietilenoUsado.calcularQuantidadeBruta();
        PolietilenoUsado.calcularValor();
        DMaterialUsado materialUsado = materialUsadoService.incluir(PolietilenoUsado);
        filho.getMateriaisUsados().add(materialUsado);
    }
}
