import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as poliesterService from '../../../../../services/poliesterService';
import ButtonInverse from '../../../../../components/ButtonInverse';
import SearchBar from '../../../../../components/SearchBar';
import ButtonNextPage from '../../../../../components/ButtonNextPage';
import DialogInfo from '../../../../../components/DialogInfo';
import DialogConfirmation from '../../../../../components/DialogConfirmation';
import { DPoliester } from '../../../../../models/poliester';
import DropdownMenu from '../../../../../components/DropdownMenu';
import { hasAnyRoles } from '../../../../../services/authService';

type QueryParams = {
    page: number;
    descricao: string;
}

export default function PolyesterList() {

    const navigate = useNavigate();

    const [dialogInfoData, setDialogInfoData] = useState({
        visible: false,
        message: "Sucesso!"
    });

    const [dialogConfirmationData, setDialogConfirmationData] = useState({
        visible: false,
        id: 0,
        message: "Você tem certeza?"
    });

    const [isLastPage, setIsLastPage] = useState(false);

    const [poliesters, setPoliesters] = useState<DPoliester[]>([]);

    const [queryParams, setQueryParam] = useState<QueryParams>({
        page: 0,
        descricao: ""
    });

    useEffect(() => {
        poliesterService.pesquisarTodos('descricao', '=', queryParams.descricao, queryParams.page, 8, "codigo;a")
            .then(response => {
                const nextPage = response.data.content;
                setPoliesters(poliesters.concat(nextPage));
                setIsLastPage(response.data.last);
            });
    }, [queryParams]);

    function handleNewChallengeClick() {
        navigate("/polyesters/create");
    }

    function handleSearch(searchText: string) {
        setPoliesters([]);
        setQueryParam({ ...queryParams, page: 0, descricao: searchText });
    }

    function handleNextPageClick() {
        setQueryParam({ ...queryParams, page: queryParams.page + 1 });
    }

    function handleDialogInfoClose() {
        setDialogInfoData({ ...dialogInfoData, visible: false });
    }

    function handleUpdateClick(polyesterId: number) {
        navigate(`/polyesters/${polyesterId}`);
    }

    function handleDeleteClick(polyesterId: number) {
        setDialogConfirmationData({ ...dialogConfirmationData, id: polyesterId, visible: true });
    }

    function handleDialogConfirmationAnswer(answer: boolean, polyesterId: number[]) {
        if (answer) {
            poliesterService.remover(polyesterId)
                .then(() => {
                    setPoliesters([]);
                    setQueryParam({ ...queryParams, page: 0 });
                })
                .catch(error => {
                    setDialogInfoData({
                        visible: true,
                        message: error.response.data.error
                    })
                });
        }

        setDialogConfirmationData({ ...dialogConfirmationData, visible: false });
    }

    function handleInactivate(id: number[]) {
        poliesterService.inativar(id)
        .then(() => {
            setPoliesters([]);
            setQueryParam({ ...queryParams, page: 0 });
        })
        .catch(error => {
            setDialogInfoData({
                visible: true,
                message: error.response.data.error
            });
        });
    }

    return(
        <main>
            <section id="listing-section" className="container">
                <h2 className="section-title mb20">Cadastro de Poliesters</h2>

                <div className="btn-page-container mb20">
                    <div onClick={handleNewChallengeClick}>
                        <ButtonInverse text="Novo" />
                    </div>
                </div>

                <SearchBar onSearch={handleSearch} />

                <table className="table mb20 mt20">
                    <thead>
                        <tr>
                            <th className="tb576">Código</th>
                            <th className="txt-left">Descrição</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            poliesters.filter(obj => obj.situacao !== 'LIXEIRA')
                            .map(poliester => (
                                <tr key={poliester.codigo} className={`situacao-${poliester.situacao.toLowerCase()}`}>
                                    <td className="tb576">{poliester.codigo}</td>
                                    <td className="txt-left">{poliester.descricao}</td>
                                    {hasAnyRoles(['ROLE_ADMIN', 'ROLE_ANALYST']) &&
                                        <td>
                                            <DropdownMenu
                                                onEdit={() => handleUpdateClick(poliester.codigo)}
                                                onInactivate={() => handleInactivate([poliester.codigo])}
                                                onDelete={() => handleDeleteClick(poliester.codigo)}
                                            />
                                        </td>
                                    }
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

                {
                    !isLastPage &&
                    <ButtonNextPage onNextPage={handleNextPageClick} />
                }
            </section>

            {
                dialogInfoData.visible &&
                <DialogInfo
                    message={dialogInfoData.message}
                    onDialogClose={handleDialogInfoClose}
                />
            }

            {
                dialogConfirmationData.visible &&
                <DialogConfirmation
                    id={dialogConfirmationData.id}
                    message={dialogConfirmationData.message}
                    onDialogAnswer={handleDialogConfirmationAnswer}
                />
            }
        </main>
    );
}