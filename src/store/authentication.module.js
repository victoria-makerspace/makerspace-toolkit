import { loginService } from '../services';
import { router } from '../router';


const user = JSON.parse(localStorage.getItem('user'));
const initialState = user
    ? { status: { loggedIn: true }, user }
    : { status: { loggedIn: false }, user: null };

export const authentication = {
    namespaced: true,
    state: initialState,
    actions: {
        startLogin({ commit },{ returnUrl }) {
            commit('loginRequest', { });
            loginService.startLogin(returnUrl);
        },
        login({ commit }, { sso, sig }) {
            loginService.finishLogin(sso, sig).then(
                u => {
                    commit('loginSuccess', u);
                    router.push('/');
                }
            );
        },
        logout({ commit }) {
            loginService.logout();
            commit('logout');
        }
    },
    mutations: {
        loginRequest(state) {
            state.status = { loggingIn: true };
            state.user = null;
        },
        loginSuccess(state, u) {
            state.status = { loggedIn: true };
            state.user = u;
        },
        loginFailure(state) {
            state.status = { loggedIn: false };
            state.user = null;
        },
        logout(state) {
            state.status = { loggedIn: false };
            state.user = null;
        }
    },

    getters: {
        user: (state) => {
            return state.user;
        },
        loggedIn: (state) => {
            return state.status.loggedIn;
        }
    }
}
