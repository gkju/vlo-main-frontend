import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {authSlice} from "../Slices/Auth";
import {modalSlice} from "../Slices/Modal";
import {minimalModalSlice} from "../Slices/MinimalModal";

const rootReducer = combineReducers({auth: authSlice.reducer, modal: modalSlice.reducer, minimalistModal: minimalModalSlice.reducer});

export default configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
           ignoredActions: ['minimalistModal/queueMinimalistModal', 'minimalistModal/deleteCurrentMinimalistModal']
        }
    }),
});

export type RootState = ReturnType<typeof rootReducer>
