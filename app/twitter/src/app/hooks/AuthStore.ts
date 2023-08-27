import { create } from "zustand";
interface AuthStoreProps {
    token: string | null,
    user: Object | null,
    setToken: (newToken: string) => void,
    clearToken: () => void,
    setUser: (newUser) => void,
}
const useAuthStore = create<AuthStoreProps>((set) => ({
    token: null,
    user: null,
    setToken: (newToken) => {
        set({ token: newToken });
        localStorage.setItem('JwtToken', newToken);
    },
    clearToken: () => {
        set({ token: null }),
            localStorage.removeItem('JwtToken');
    },
    setUser: (newUser) => {
        set({user: newUser});
    }
}));

export default useAuthStore;

















