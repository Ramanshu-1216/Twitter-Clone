import { error } from "console";
import { escape } from "querystring";
import { create } from "zustand";
interface UsersStoreProps {
    usersFollowing: Array<any> | null,
    usersNotFollowing: Array<any> | null,
    setFollowingUsers: (newUsers: Array<any> | null) => void,
    setNotFollowingUsers: (newUsers: Array<any> | null) => void,
}

const useUsersStore = create<UsersStoreProps>((set, get) => ({
    usersFollowing: null,
    usersNotFollowing: null,
    setFollowingUsers: (newUsers) => set({usersFollowing: newUsers}),
    setNotFollowingUsers: (newUsers) => set({usersNotFollowing: newUsers}),
}));

export default useUsersStore;

















