import {IdTokenClaims, User} from "oidc-client-ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../Store/Store";
import {EmptyObj} from "../../Utils";


interface authState {
    loggedIn: boolean,
    profile?: IdTokenClaims
    lastKnownUrl: string
}

const initialState = {loggedIn: false, profile: {}, lastKnownUrl: "/"} as authState;

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLoggedIn(state: authState, action: PayloadAction<{profile: IdTokenClaims}>) {
            state.loggedIn = true;
            state.profile = action.payload.profile;
        },
        setLoggedOut(state: authState) {
            state.loggedIn = false;
            state.profile = undefined;
        },
        setLastKnownUrl(state: authState, action: PayloadAction<{url: string}>) {
            state.lastKnownUrl = action.payload.url;
        }
    }
})

export const selectProfile = (state: RootState) => state.auth.profile;
export const selectLoggedIn = (state: RootState) => state.auth.loggedIn;
export const selectLastKnownUrl = (state: RootState) => state.auth.lastKnownUrl;

export const {setLoggedIn, setLoggedOut, setLastKnownUrl} = authSlice.actions;
