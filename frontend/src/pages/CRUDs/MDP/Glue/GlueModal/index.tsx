import React, { ReactNode, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useForm } from "react-hook-form";
import FlatPicker from 'react-flatpickr';
import { toast } from 'react-toastify';
import * as glueService from 'services/MDP/glueService';
import { DGlue } from 'models/entities';
import {ReactComponent as EditSvg} from "assets/images/edit.svg";
import {ReactComponent as AddSvg} from "assets/images/add.svg";

type GlueModalProps = {
    glue?: DGlue;
    isOpen: boolean;
    isEditing: boolean;
    onClose: () => void;
    onDeleteOrEdit: () => void;
    children?: ReactNode;
}

const GlueModal: React.FC<GlueModalProps> = ({ glue, isOpen, isEditing, onClose, onDeleteOrEdit }) => {

  const [errorMessage, setErrorMessage] = useState<string>('');
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<DGlue>();
  const [dateTime, setDateTime] = useState<Date | null>(null);

  // load inputs

  useEffect(() => {
    if(isEditing && glue){
        glueService.findById(glue.code)
        .then((response) => {
            const fetchedGlue = response.data as DGlue;

            setValue('code', fetchedGlue.code);
            setValue('description', fetchedGlue.description);
            setValue('family', fetchedGlue.family);
            setValue('implementation', fetchedGlue.implementation);
            setValue('lostPercentage', fetchedGlue.lostPercentage);
            setValue('grammage', fetchedGlue.grammage);
            setValue('value', fetchedGlue.value);

            setDateTime(fetchedGlue.implementation ? new Date(fetchedGlue.implementation) : null);
        });
    }
  }, [isEditing, glue, setValue]);

  // insert / update method

  const insertOrUpdate = (formData: DGlue) => {

    if (dateTime !== null) {
      formData.implementation = dateTime;
    }
  
    const serviceFunction = isEditing ? glueService.update : glueService.insert;
    const successMessage = isEditing ? 'Cola editada!' : 'Cola inserida!';
  
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
                    <label htmlFor="">Gramatura</label>
                    <input 
                        {...register("grammage", {
                            pattern: {
                                value: /^\d+(\.\d{1,3})?$/, 
                                message: 'Por favor, insira um número válido'
                            }
                        })}
                        type="text" 
                        inputMode="numeric" 
                        className={`form-control base-input ${errors.grammage ? 'is-invalid' : ''}`}
                        placeholder="Gramatura"
                        name="grammage"
                    />
                    {errors.grammage && <div className='invalid-feedback d-block'>{errors.grammage.message}</div>}
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
                    <label htmlFor="">Valor por KG</label>
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

export default GlueModal;
