import {authoritySettings} from "../Config";
import {User, UserManager, IdTokenClaims} from "oidc-client-ts";
import Store from "../Redux/Store/Store";
import { setLoggedIn, setLoggedOut } from "../Redux/Slices/Auth";

class AuthService {
    private userManager?: UserManager = undefined;

    async ensureUserManagerCreated() {
        if(!this.userManager) {
            this.userManager = new UserManager(authoritySettings);
            this.userManager.events.addUserLoaded(this.onUserLoaded);
            this.userManager.events.addSilentRenewError(this.onSilentRenewError);
            this.userManager.events.addAccessTokenExpired(this.onAccessTokenExpired);
            this.userManager.events.addAccessTokenExpiring(this.onAccessTokenExpiring);
            this.userManager.events.addUserUnloaded(this.onUserUnloaded);
            this.userManager.events.addUserSignedOut(this.onUserSignedOut);
        }
    }

    async signInSilent() {
        await this.ensureUserManagerCreated();
        // fixes intellisense
        if(!this.userManager) {
            return;
        }

        await this.userManager.signinSilent();
        await this.setUser();
    }

    async signInPopUp() {
        await this.ensureUserManagerCreated();
        // fixes intellisense
        if(!this.userManager) {
            return;
        }

        await this.userManager.signinPopup()
        await this.setUser();
    }

    async signInRedirect() {
        await this.ensureUserManagerCreated();
        // fixes intellisense
        if(!this.userManager) {
            return;
        }

        await this.userManager.signinRedirect();
        await this.setUser();
    }

    async processSignInUrl(url: string): Promise<boolean> {
        await this.ensureUserManagerCreated();
        // fixes intellisense
        if(!this.userManager) {
            return false;
        }

        await this.userManager.signinCallback(url);
        await this.setUser();
        return true;
    }

    async processSignOutUrl(url: string) {
        await this.ensureUserManagerCreated();
        // fixes intellisense
        if(!this.userManager) {
            return false;
        }

        await this.userManager.signoutCallback(url);
        return true;
    }

    async signOut() {
        await this.userManager?.signoutRedirect();
    }

    async setUser() {
        await this.ensureUserManagerCreated();
        // fixes intellisense, cannot be in separate function
        if(!this.userManager) {
            return false;
        }
        let profile = (await this.userManager.getUser())?.profile;
        if(!profile) {
            throw new Error("Profile is undefined");
        }
        Store.dispatch(setLoggedIn({profile}));
    }

    async GetToken() {
        await this.ensureUserManagerCreated();
        // fixes intellisense
        if(!this.userManager) {
            throw new Error("???");
        }

        return (await this.userManager.getUser())?.access_token || "";
    }

    onUserLoaded = (user: any) => {
        Store.dispatch(setLoggedIn({profile: user.profile}));
    }

    onSilentRenewError = (error: any) => {
        Store.dispatch(setLoggedOut());
    }

    onAccessTokenExpired = () => {
        Store.dispatch(setLoggedOut());
    }

    onUserUnloaded = () => {
        Store.dispatch(setLoggedOut());
    }

    onAccessTokenExpiring = () => {

    }

    onUserSignedOut = () => {
        Store.dispatch(setLoggedOut());
    }

    static get instance() { return authService }
}

export const authService = new AuthService();

export default authService;
