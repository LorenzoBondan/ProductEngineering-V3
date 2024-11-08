package br.com.todeschini.persistence.entities.enums.converters;

import br.com.todeschini.persistence.entities.enums.SituacaoEnum;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter(autoApply = true)
public class SituacaoEnumConverter implements AttributeConverter<SituacaoEnum, String> {

    @Override
    public String convertToDatabaseColumn(SituacaoEnum attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getLabel();
    }

    @Override
    public SituacaoEnum convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return SituacaoEnum.valueOf(dbData.toUpperCase());
    }
}

