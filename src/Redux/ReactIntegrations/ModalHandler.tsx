import {FunctionComponent} from "react";
import {useSelector} from "react-redux";
import {deleteCurrentModal, modal, selectCurrentModal} from "../Slices/Modal";
import {Button, InputSize, Modal} from "@gkju/vlo-ui";
import Store from "../Store/Store";
import styled from "styled-components";
import {GetBackground} from "../../ThemeProvider";

export const ModalHandler : FunctionComponent = (props) => {
    const modalData = useSelector(selectCurrentModal);

    const closeHandler = () => {
        if(modalData?.cancelHandler) {
            modalData.cancelHandler();
        }
        Store.dispatch(deleteCurrentModal());
    };

    const successHandler = () => {
        if(modalData?.handler) {
            modalData.handler();
        }
        closeHandler();
    };

    return (
        <div className="z-20">
            <Modal open={modalData !== undefined} close={closeHandler}>
                <ModalBody modal={modalData} closeHandler={closeHandler} successHandler={successHandler} />
            </Modal>
        </div>
    );
};

interface modalBodyProps {
    modal?: modal,
    closeHandler: () => void,
    successHandler: () => void
}

const ModalBody: FunctionComponent<modalBodyProps> = (props) => {
    let modal = props.modal;

    if(!modal) {
        return (
            <ModalBase>

            </ModalBase>
        )
    }

    return (
        <ModalBase>
            <ModalHeader>
                {modal.title}
            </ModalHeader>
            <ModalContent>{modal.content}</ModalContent>
            <ButtonsWrapper>
                <div style={{gridColumn: 2}}>
                    <CancelButtonStyled wrapperStyle={{width: "100%"}} style={modal.buttonStyle} onClick={props.closeHandler}>
                        {modal.cancelText ?? "Anuluj"}
                    </CancelButtonStyled>
                </div>
                <div style={{gridColumn: 4}}>
                    <ButtonStyled wrapperStyle={{width: "100%"}} style={modal.buttonStyle} onClick={props.successHandler}>
                        {modal.buttonText ?? "OK"}
                    </ButtonStyled>
                </div>
            </ButtonsWrapper>

        </ModalBase>
    );
};

const ModalBase = styled.div`
    display: grid;
    grid-template-rows: 0.5fr 4fr 1fr 10fr 1fr 0.5fr 2fr;
    background: ${GetBackground()};
    width: min(600px, 80vw);
    height: min(400px, 60vh);
    border-radius: 20px;
`;

const ModalContent = styled.div`
    grid-row: 4;
`;

const ModalHeader = styled.div`
    padding: 20px 30px;
    width: 100%;
    text-align: left;
    font-size: 40px;
    grid-row: 2;
`;

const CancelButtonStyled = styled(Button)`
    background: transparent;
    box-shadow: inset 0 0 0 2px #6C5DD3;
    width: 100%;
`;

const ButtonStyled = styled(Button)`
    width: 100%;
`;

const ButtonsWrapper = styled.div`
    grid-row: 6;
    display: grid;
    grid-template-columns: 1fr 5fr 1fr 5fr 1fr;
`
