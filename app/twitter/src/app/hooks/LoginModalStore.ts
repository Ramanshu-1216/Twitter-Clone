import { create } from "zustand";
interface LoginModalStoreProps {
    isOpen: boolean,
    onOpen: () => void,
    onClose: () => void,
}
const useLoginModal = create<LoginModalStoreProps>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
export default useLoginModal;