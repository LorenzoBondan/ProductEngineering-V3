package br.com.todeschini.webapi.api.v1.rest.packaging.usednonwovenfabric.projection;

import com.fasterxml.jackson.annotation.JsonProperty;

public interface UsedNonwovenFabricDTO {

    @JsonProperty(value = "id", index = 1)
    Long getId();
    @JsonProperty(value = "nonwovenFabricCode", index = 2)
    Long getNonwovenFabricCode();
    @JsonProperty(value = "ghostCode", index = 3)
    String getGhostCode();
    @JsonProperty(value = "netQuantity", index = 4)
    Double getNetQuantity();
    @JsonProperty(value = "grossQuantity", index = 5)
    Double getGrossQuantity();
    @JsonProperty(value = "measurementUnit", index = 6)
    String getMeasurementUnit();
}
