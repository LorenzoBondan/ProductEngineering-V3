import DescriptionFilter, { DescriptionFilterData } from "Components/Filters/DescriptionFilter";
import { DPaintingSon } from "models/entities";
import { useCallback, useEffect, useState } from "react";
import Pagination from "Components/Pagination";
import { SpringPage } from "types";
import * as PaintingSonService from 'services/MDF/paintingSonService';
import { useHistory } from "react-router-dom";
import PaintingSonModal from "../PaintingSonModal";
import PaintingSonRow from "../PaintingSonRow";


type ControlComponentsData = {
    activePage: number;
    filterData: DescriptionFilterData;
}

const List = () => {

    // filter 

    const [controlComponentsData, setControlComponentsData] = useState<ControlComponentsData>({activePage:0, filterData: { description: '', status: undefined }});

    const handlePageChange = (pageNumber : number) => {
        setControlComponentsData({activePage: pageNumber, filterData: controlComponentsData.filterData});
    }

    const handleSubmitFilter = (data : DescriptionFilterData) => {
        setControlComponentsData({activePage: 0, filterData: data});
    }

    // findAll

    const [page, setPage] = useState<SpringPage<DPaintingSon>>();

    const getPaintingSons = useCallback(() => {

        PaintingSonService.findAll(controlComponentsData.filterData.description, controlComponentsData.activePage, 10, controlComponentsData.filterData.status)
            .then(response => {
                setPage(response.data);
                window.scrollTo(0, 0);
            });
    }, [controlComponentsData])

    useEffect(() => {
        getPaintingSons();
    }, [getPaintingSons]);

    // modal functions

    const [modalIsOpen, setIsOpen] = useState(false);

    const openModal = () => {
        setIsOpen(true);
    }
    
    const closeModal = () => {
        setIsOpen(false);
    }

    const history = useHistory();

    const handleRowClick = (code: string) => {
        history.push(`/sons/${code}`);
    }

    return(
        <div className='crud-container'>
            <div className="crud-content-container">
                <div className="crud-bar-container">
                    <button className="btn btn-primary btn-crud-add" style={{color:"white", marginBottom:"20px"}} onClick={openModal}>
                        Adicionar novo Filho
                    </button>
                    <PaintingSonModal isOpen={modalIsOpen} isEditing={false} onClose={closeModal} onDeleteOrEdit={() => getPaintingSons()} />
                </div>
                <div className='search-bar-container'>
                    <DescriptionFilter onSubmitFilter={handleSubmitFilter} />

                </div>
                <div className='crud-table-container'>
                    <table className='crud-table'>
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Descrição</th>
                                <th>Medida 1</th>
                                <th>Medida 2</th>
                                <th>Medida 3</th>
                                <th>Unidade de Medida</th>
                                <th>Implementação</th>
                                <th>Cor</th>
                                <th>Valor/UN</th>
                                <th>Código Pai</th>
                                <th>Tipo</th>
                                <th>Faces</th>
                                <th>Especial</th>
                                <th>Fundo</th>
                                <th>Editar</th>
                                <th>Inativar</th>
                                <th>Excluir</th>
                            </tr>
                        </thead>
                        <tbody>
                            {page?.content.map((item) => (
                                <PaintingSonRow PaintingSon={item} onDeleteOrEdit={getPaintingSons} handleRowClick={handleRowClick} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className='pagination-container'>
                <Pagination 
                    pageCount={(page) ? page.totalPages : 0} 
                    range={2}
                    onChange={handlePageChange}
                    forcePage={page?.number}
                />
            </div>
        </div>
    );
}

export default List;