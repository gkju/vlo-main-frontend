import { MinimalModalProps } from "@gkju/vlo-ui";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../Store/Store";

export interface minimalModal {
    handler: (input: string) => void;
    placeholder: string;
    validator: (input: string) => void,
    initialValue?: string,
    password?: boolean,
}

interface minimalistModalState {
    minimalistModals: minimalModal[]
}

const initialState = {minimalistModals: []} as minimalistModalState;

export const minimalModalSlice = createSlice({
    name: "minimalistModal",
    initialState,
    reducers: {
        queueMinimalistModal: (state: minimalistModalState, action: PayloadAction<minimalModal>) => {
            state.minimalistModals.push(action.payload);
        },
        deleteCurrentMinimalistModal: (state: minimalistModalState) => {
            state.minimalistModals.shift();
        },
    },
});

export const selectCurrentMinimalistModal = (state: RootState) => state.minimalistModal.minimalistModals[0];

export const {queueMinimalistModal, deleteCurrentMinimalistModal} = minimalModalSlice.actions;
