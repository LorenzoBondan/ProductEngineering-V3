import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as pinturaBordaFundoService from '../../../../../services/pinturaBordaFundoService';
import ButtonInverse from '../../../../../components/ButtonInverse';
import SearchBar from '../../../../../components/SearchBar';
import ButtonNextPage from '../../../../../components/ButtonNextPage';
import DialogInfo from '../../../../../components/DialogInfo';
import DialogConfirmation from '../../../../../components/DialogConfirmation';
import { DPinturaBordaFundo } from '../../../../../models/pinturaBordaFundo';
import DropdownMenu from '../../../../../components/DropdownMenu';
import { hasAnyRoles } from '../../../../../services/authService';

type QueryParams = {
    page: number;
    descricao: string;
}

export default function PaintingBorderBackgroundList() {

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

    const [pinturaBordaFundos, setPinturaBordaFundos] = useState<DPinturaBordaFundo[]>([]);

    const [queryParams, setQueryParam] = useState<QueryParams>({
        page: 0,
        descricao: ""
    });

    useEffect(() => {
        pinturaBordaFundoService.pesquisarTodos('descricao', '=', queryParams.descricao, queryParams.page, 8, "codigo;a")
            .then(response => {
                const nextPage = response.data.content;
                setPinturaBordaFundos(pinturaBordaFundos.concat(nextPage));
                setIsLastPage(response.data.last);
            });
    }, [queryParams]);

    function handleNewChallengeClick() {
        navigate("/paintingborderbackgrounds/create");
    }

    function handleSearch(searchText: string) {
        setPinturaBordaFundos([]);
        setQueryParam({ ...queryParams, page: 0, descricao: searchText });
    }

    function handleNextPageClick() {
        setQueryParam({ ...queryParams, page: queryParams.page + 1 });
    }

    function handleDialogInfoClose() {
        setDialogInfoData({ ...dialogInfoData, visible: false });
    }

    function handleUpdateClick(paintingBorderBackgroundId: number) {
        navigate(`/paintingborderbackgrounds/${paintingBorderBackgroundId}`);
    }

    function handleDeleteClick(paintingBorderBackgroundId: number) {
        setDialogConfirmationData({ ...dialogConfirmationData, id: paintingBorderBackgroundId, visible: true });
    }

    function handleDialogConfirmationAnswer(answer: boolean, paintingBorderBackgroundId: number[]) {
        if (answer) {
            pinturaBordaFundoService.remover(paintingBorderBackgroundId)
                .then(() => {
                    setPinturaBordaFundos([]);
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
        pinturaBordaFundoService.inativar(id)
        .then(() => {
            setPinturaBordaFundos([]);
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
                <h2 className="section-title mb20">Cadastro de Pintura de Borda de Fundo</h2>

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
                            <th className="txt-left">Cor</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            pinturaBordaFundos.filter(obj => obj.situacao !== 'LIXEIRA')
                            .map(pintura => (
                                <tr key={pintura.codigo} className={`situacao-${pintura.situacao.toLowerCase()}`}>
                                    <td className="tb576">{pintura.codigo}</td>
                                    <td className="txt-left">{pintura.descricao}</td>
                                    {pintura.cor ? <td className="txt-left">{pintura.cor.descricao}</td> : <td className="txt-left"></td>}
                                    {hasAnyRoles(['ROLE_ADMIN', 'ROLE_ANALYST']) &&
                                        <td>
                                            <DropdownMenu
                                                onEdit={() => handleUpdateClick(pintura.codigo)}
                                                onInactivate={() => handleInactivate([pintura.codigo])}
                                                onDelete={() => handleDeleteClick(pintura.codigo)}
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