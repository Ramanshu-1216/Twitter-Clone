import { create } from "zustand";
interface FeedStoreProps {
    posts: Array<any> | null,
    setPost: (newPost: Array<any>) => void,
}
const useFeedStore = create<FeedStoreProps>((set) => ({
    posts: null,
    setPost: (newPost) => set({posts: newPost})
}));

export default useFeedStore;

















