import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'flatpickr/dist/themes/material_red.css';
import Flatpickr from "react-flatpickr";
import FormInput from '../../../../../components/FormInput';
import FormSelect from '../../../../../components/FormSelect';
import * as forms from '../../../../../utils/forms';
import * as chapaService from '../../../../../services/chapaService';
import * as corService from '../../../../../services/corService';
import { DCor } from '../../../../../models/cor';
import { DTipoMaterialEnum } from '../../../../../models/enums/tipoMaterial';

export default function Form() {

    const params = useParams();

    const navigate = useNavigate();

    const isEditing = params.sheetId !== 'create';

    const [cores, setCores] = useState<DCor[]>([]);

    const [formData, setFormData] = useState<any>({
        descricao: {
            value: "",
            id: "descricao",
            name: "descricao",
            type: "text",
            placeholder: "Descrição",
            validation: function (value: string) {
                return /^.{3,50}$/.test(value);
            },
            message: "Descrição deve ter entre 3 e 50 caracteres"
        },
        tipoMaterial: {
            value: null,
            id: "tipoMaterial",
            name: "tipoMaterial",
            placeholder: "Tipo de Material",
            validation: (value: any) => value !== null,
            message: "Tipo de Material é obrigatório",
        },
        implantacao: {
            value: "",
            id: "implantacao",
            name: "implantacao",
            placeholder: "Implantação"
        },
        porcentagemPerda: {
            value: null,
            id: "porcentagemPerda",
            name: "porcentagemPerda",
            type: "number",
            placeholder: "Porcentagem de perda",
            validation: function (value: any) {
                return value === "" || value === null || Number(value) >= 0;
            },
            message: "Porcentagem de perda não pode ser negativa"
        },
        valor: {
            value: null,
            id: "valor",
            name: "valor",
            type: "number",
            placeholder: "Valor",
            validation: function (value: any) {
                return value === "" || value === null || Number(value) >= 0;
            },
            message: "Valor não pode ser negativo"
        },
        cor: {
            value: null,
            id: "cor",
            name: "cor",
            placeholder: "Cor"
        },
        espessura: {
            value: null,
            id: "espessura",
            name: "espessura",
            type: "number",
            placeholder: "Espessura",
            validation: function (value: any) {
                return value === "" || value === null || Number(value) >= 0;
            },
            message: "Espessura não pode ser negativa"
        },    
        faces: {
            value: null,
            id: "faces",
            name: "faces",
            type: "number",
            placeholder: "Faces",
            validation: function (value: any) {
                return value === "" || value === null || Number(value) >= 0;
            },
            message: "Faces não pode ser negativa"
        },
    });

    useEffect(() => {
        corService.pesquisarTodos("", "", "")
            .then(response => {
                setCores(response.data.content);
            });
    }, []);

    useEffect(() => {
        if (isEditing) {
            chapaService.pesquisarPorId(Number(params.sheetId))
                .then(response => {
                    const newFormData = forms.updateAll(formData, response.data);
                    
                    // enums
                    const tipoMaterialValue = response.data.tipoMaterial;
                    newFormData.tipoMaterial.value = tipoMaterialOptions.find(option => option.value === tipoMaterialValue);

                    // dates
                    setDateTimeStart(response.data.implantacao ? new Date(response.data.implantacao).toISOString().split('T')[0] : '');

                    setFormData(newFormData);
                });
        }
    }, []);

    function handleInputChange(event: any) {
        setFormData(forms.updateAndValidate(formData, event.target.name, event.target.value));
    }

    function handleTurnDirty(name: string) {
        setFormData(forms.dirtyAndValidate(formData, name));
    }

    function handleSubmit(event: any) {
        event.preventDefault();

        const formDataValidated = forms.dirtyAndValidateAll(formData);
        if (forms.hasAnyInvalid(formDataValidated)) {
            setFormData(formDataValidated);
            return;
        }

        const requestBody = forms.toValues(formData);

        // date format
        requestBody.implantacao = dateTimeStart;

        // enum format
        requestBody.tipoMaterial = formData.tipoMaterial.value.value;

        // nullable fields
        ['cor', 'implantacao'].forEach((field) => {
            if (requestBody[field] === "") {
                requestBody[field] = null;
            }
        });

        if (isEditing) {
            requestBody.codigo = Number(params.sheetId);
        }

        const request = isEditing
            ? chapaService.atualizar(requestBody)
            : chapaService.criar(requestBody);

        request
            .then(() => {
                navigate("/sheets");
            })
            .catch(error => {
                const newInputs = forms.setBackendErrors(formData, error.response.data.errors);
                setFormData(newInputs);
            });
    }

    const tipoMaterialOptions = Object.values(DTipoMaterialEnum).map((item) => ({
        value: item.name,
        label: item.label,
    }));

    const [dateTimeStart, setDateTimeStart] = useState('');

    const handleDateTimeStartChange = (selectedDateTime: string | Date[]) => {
        if (Array.isArray(selectedDateTime) && selectedDateTime.length > 0) {
            const selectedDate = selectedDateTime[0] as Date;
            const formattedDate = selectedDate.toISOString().split('T')[0]; // Extrai "yyyy-MM-dd"
            setDateTimeStart(formattedDate);
        } else {
            setDateTimeStart('');
        }
    };  
    
    return(
        <main>
            <section id="form-section" className="container">
                <div className="form-container">
                    <form className="card form" onSubmit={handleSubmit}>
                        <h2>Chapa</h2>
                        <div className="form-controls-container">
                            <div>
                                <label htmlFor="">Descrição</label>
                                <FormInput
                                    {...formData.descricao}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.descricao.message}</div>
                            </div>
                            <div>
                                <label htmlFor="">Tipo de Material</label>
                                <FormSelect
                                    {...formData.tipoMaterial}
                                    className="form-control form-select-container"
                                    options={tipoMaterialOptions}
                                    value={formData.tipoMaterial.value}
                                    onChange={(selectedOption: any) => {
                                        const newFormData = forms.updateAndValidate(
                                            formData,
                                            "tipoMaterial",
                                            selectedOption
                                        );
                                        setFormData(newFormData);
                                    }}
                                    onTurnDirty={handleTurnDirty}
                                />
                                <div className="form-error">{formData.tipoMaterial.message}</div>
                            </div>
                            <div>
                                <label htmlFor="">Cor</label>
                                <FormSelect
                                    {...formData.cor}
                                    className="form-control form-select-container"
                                    options={cores}
                                    value={formData.cor.value}
                                    onChange={(selectedOption: any) => {
                                        const newFormData = forms.updateAndValidate(
                                            formData,
                                            "cor",
                                            selectedOption
                                        );
                                        setFormData(newFormData);
                                    }}
                                    onTurnDirty={handleTurnDirty}
                                    getOptionLabel={(obj: any) => obj.descricao}
                                    getOptionValue={(obj: any) => String(obj.id)}
                                />
                                <div className="form-error">{formData.cor.message}</div>
                            </div>
                            <div>
                                <label htmlFor="">Valor</label>
                                <FormInput
                                    {...formData.valor}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.valor.message}</div>
                            </div>
                            <div>
                                <label htmlFor="">Porcentagem de Perda</label>
                                <FormInput
                                    {...formData.porcentagemPerda}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.porcentagemPerda.message}</div>
                            </div>
                            <div>
                                <label htmlFor="">Implantação</label>
                                <Flatpickr
                                    id="implantacao"
                                    name="implantacao"
                                    value={dateTimeStart}
                                    onChange={(selectedDateTime: Date[]) => handleDateTimeStartChange(selectedDateTime)}
                                    options={{
                                        enableTime: false,
                                        dateFormat: 'Y-m-d',
                                    }}
                                    className="form-control"
                                />
                          </div>
                          <div>
                                <label htmlFor="">Espessura</label>
                                <FormInput
                                    {...formData.espessura}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.espessura.message}</div>
                            </div>
                            <div>
                                <label htmlFor="">Faces</label>
                                <FormInput
                                    {...formData.faces}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.faces.message}</div>
                            </div>
                        </div>
                        <div className="form-buttons">
                            <Link to="/sheets">
                                <button type="reset" className="btn btn-white">Cancelar</button>
                            </Link>
                            <button type="submit" className="btn btn-primary">Salvar</button>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    );
}