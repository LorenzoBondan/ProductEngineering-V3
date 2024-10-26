package br.com.todeschini.domain.business.publico.pinturabordafundousada;

import br.com.todeschini.domain.Descritivel;
import br.com.todeschini.domain.business.publico.materialusado.DMaterialUsado;
import br.com.todeschini.domain.exceptions.ValidationException;
import br.com.todeschini.domain.metadata.Domain;
import br.com.todeschini.domain.util.FormatadorNumeros;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Domain
public class DPinturaBordaFundoUsada extends DMaterialUsado implements Descritivel  {

    public DPinturaBordaFundoUsada(Integer codigo){
        this.setCodigo(codigo);
    }

    @Override
    public void validar() throws ValidationException {
        super.validar();
    }

    @Override
    public String getDescricao() {
        return super.getDescricao();
    }

    @Override
    public Double calcularQuantidadeLiquida(){
        double quantidade = ((double) this.getFilho().getMedidas().getAltura() / 1000 +
                (double) this.getFilho().getMedidas().getLargura() / 1000) * 2
                * ((double) this.getFilho().getMedidas().getEspessura() / 1000);
        this.setQuantidadeLiquida(FormatadorNumeros.formatarQuantidade(quantidade));
        return this.getQuantidadeLiquida();
    }
}
