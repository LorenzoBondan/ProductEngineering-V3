import React, { ReactNode, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { Controller, useForm } from "react-hook-form";
import FlatPicker from 'react-flatpickr';
import Select from 'react-select';
import { toast } from 'react-toastify';
import * as edgeBandingService from 'services/MDP/edgeBandingService';
import * as colorService from 'services/public/colorService';
import { DColor, DEdgeBanding } from 'models/entities';
import {ReactComponent as EditSvg} from "assets/images/edit.svg";
import {ReactComponent as AddSvg} from "assets/images/add.svg";

type EdgeBandingModalProps = {
    edgeBanding?: DEdgeBanding;
    isOpen: boolean;
    isEditing: boolean;
    onClose: () => void;
    onDeleteOrEdit: () => void;
    children?: ReactNode;
}

const EdgeBandingModal: React.FC<EdgeBandingModalProps> = ({ edgeBanding, isOpen, isEditing, onClose, onDeleteOrEdit }) => {

  const [errorMessage, setErrorMessage] = useState<string>('');
  const { register, handleSubmit, formState: { errors }, setValue, control } = useForm<DEdgeBanding>();
  const [selectColors, setSelectColors] = useState<DColor[]>();
  const [dateTime, setDateTime] = useState<Date | null>(null);

  // load inputs

  useEffect(() => {
    if(isEditing && edgeBanding){
        edgeBandingService.findById(edgeBanding.code)
        .then((response) => {
            const fetchedEdgeBanding = response.data as DEdgeBanding;

            setValue('code', fetchedEdgeBanding.code);
            setValue('description', fetchedEdgeBanding.description);
            setValue('family', fetchedEdgeBanding.family);
            setValue('implementation', fetchedEdgeBanding.implementation);
            setValue('lostPercentage', fetchedEdgeBanding.lostPercentage);
            setValue('color', fetchedEdgeBanding.color);
            setValue('height', fetchedEdgeBanding.height);
            setValue('thickness', fetchedEdgeBanding.thickness);
            setValue('value', fetchedEdgeBanding.value);

            setDateTime(fetchedEdgeBanding.implementation ? new Date(fetchedEdgeBanding.implementation) : null);
        });
    }
  }, [isEditing, edgeBanding, setValue]);

  // populate comboboxes

  useEffect(() => {

    if(edgeBanding?.color){
        colorService.findAllActiveAndCurrentOne(edgeBanding?.color.code)
            .then(response => setSelectColors(response.data));
    } else{
        colorService.findAll('')
            .then(response => setSelectColors(response.data.content));
    }

  }, [edgeBanding?.color]);

  // insert / update method

  const insertOrUpdate = (formData: DEdgeBanding) => {
    if (dateTime !== null) {
      formData.implementation = dateTime;
    }
  
    const serviceFunction = isEditing ? edgeBandingService.update : edgeBandingService.insert;
    const successMessage = isEditing ? 'Fita Borda editada!' : 'Fita Borda Inserida!';
  
    serviceFunction(formData)
      .then(response => {
        console.log(response.data);
        setErrorMessage('');
        toast.success(successMessage);
        onClose();
        onDeleteOrEdit();
      })
      .catch(error => {
        toast.error(error.response.data.error);
        setErrorMessage(error.response.data.error);
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Example Modal"
      overlayClassName="modal-overlay"
      className="modal-content"
    >
      <form onSubmit={handleSubmit(insertOrUpdate)} className="crud-modal-form">
        {isEditing ? <div className='crud-modal-title'><EditSvg/><h2>Editar</h2></div> : <div className='crud-modal-title'><AddSvg/><h2>Adicionar</h2></div>}
        <div className="row crud-modal-inputs-container">
            <div className="col-lg-6 crud-modal-half-container">
                <div className='margin-bottom-10'>
                    <label htmlFor="">Código</label>
                    <input 
                        {...register("code", {
                        required: 'Campo obrigatório', minLength: 7
                        })}
                        type="number"
                        inputMode="numeric"
                        className={`form-control base-input ${errors.code ? 'is-invalid' : ''}`}
                        placeholder="Código"
                        name="code"
                        disabled={isEditing}
                    />
                    <div className='invalid-feedback d-block'>{errors.code?.message}</div>
                </div> 
                <div className='margin-bottom-10'>
                    <label htmlFor="">Descrição</label>
                    <input 
                        {...register("description", {
                        required: 'Campo obrigatório', minLength: 3
                        })}
                        type="text"
                        className={`form-control base-input ${errors.description ? 'is-invalid' : ''}`}
                        placeholder="Descrição"
                        name="description"
                    />
                    <div className='invalid-feedback d-block'>{errors.description?.message}</div>
                </div>  
                <div className='margin-bottom-10'>
                    <label htmlFor="">Família</label>
                    <input 
                        {...register("family", {
                        })}
                        type="text"
                        className={`form-control base-input ${errors.family ? 'is-invalid' : ''}`}
                        placeholder="Família"
                        name="family"
                    />
                    {errors.family && <div className='invalid-feedback d-block'>{errors.family.message}</div>}
                </div>
                <div className='margin-bottom-10'>
                    <label htmlFor="">Altura</label>
                    <input 
                        {...register("height", {
                        })}
                        type="number"
                        inputMode="numeric"
                        className={`form-control base-input ${errors.height ? 'is-invalid' : ''}`}
                        placeholder="Altura"
                        name="height"
                    />
                    {errors.height && <div className='invalid-feedback d-block'>{errors.height.message}</div>}
                </div>
                <div className='margin-bottom-10'>
                    <label htmlFor="">Espessura</label>
                    <input 
                        {...register("thickness", {
                        })}
                        type="number"
                        inputMode="numeric"
                        className={`form-control base-input ${errors.thickness ? 'is-invalid' : ''}`}
                        placeholder="Espessura"
                        name="thickness"
                    />
                    {errors.thickness && <div className='invalid-feedback d-block'>{errors.thickness.message}</div>}
                </div>
            </div>
            <div className="col-lg-6 crud-modal-half-container">
                <div className='margin-bottom-10'>
                    <label htmlFor="">% Perda</label>
                    <input 
                        {...register("lostPercentage", {
                            pattern: {
                                value: /^\d+(\.\d{1,2})?$/, 
                                message: 'Por favor, insira um número válido'
                            }
                        })}
                        type="text" 
                        inputMode="numeric" 
                        className={`form-control base-input ${errors.lostPercentage ? 'is-invalid' : ''}`}
                        placeholder="% Perda"
                        name="lostPercentage"
                    />
                    {errors.lostPercentage && <div className='invalid-feedback d-block'>{errors.lostPercentage.message}</div>}
                </div>
                <div className='margin-bottom-10'>
                    <label>Implementação</label>
                    <FlatPicker
                        value={dateTime || undefined}
                        onChange={(date) => setDateTime(date[0])}
                        options={{
                            enableTime: false,
                            dateFormat: 'Y-m-d',
                        }}
                        className="base-input time-input"
                        name="implementation"
                    />
                </div>
                <div className='margin-bottom-10'>
                    <label htmlFor="">Cor</label> 
                    <Controller 
                        name = 'color'
                        rules = {{required: true}}
                        control = {control}
                        render = {( {field} ) => (
                            <Select 
                                {...field}
                                options={selectColors}
                                classNamePrefix="margin-bottom-20"
                                className="margin-bottom-20"
                                placeholder="Cor"
                                getOptionLabel={(color: DColor) => color.name}
                                getOptionValue={(color: DColor) => color.code.toString()}
                            />    
                        )}
                    />
                    {errors.color && (
                        <div className='invalid-feedback d-block'>Campo obrigatório</div>
                    )}
                </div>    
                <div className='margin-bottom-10'>
                    <label htmlFor="">Valor por Metro</label>
                    <input 
                        {...register("value", {
                            pattern: {
                                value: /^\d+(\.\d{1,2})?$/, 
                                message: 'Por favor, insira um número válido'
                            }
                        })}
                        type="text" 
                        inputMode="numeric" 
                        className={`form-control base-input ${errors.value ? 'is-invalid' : ''}`}
                        placeholder="Valor"
                        name="value"
                    />
                    {errors.value && <div className='invalid-feedback d-block'>{errors.value.message}</div>}
                </div>              
            </div>
            {errorMessage && <div className='invalid-feedback d-block'>{errorMessage}</div>}
        </div>
        <div className="crud-modal-buttons-container">
          <button onClick={onClose} className="btn cancel-button crud-modal-button">Cancelar</button>
          <button type="submit" className="btn btn-primary text-white crud-modal-button">Salvar</button>
        </div>
      </form>
    </Modal>
  );
};

export default EdgeBandingModal;
