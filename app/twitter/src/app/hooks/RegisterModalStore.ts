import { create } from "zustand";
interface RegisterModalStoreProps {
    isOpen: boolean,
    onOpen: () => void,
    onClose: () => void,
}
const useRegisterModal = create<RegisterModalStoreProps>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
export default useRegisterModal;