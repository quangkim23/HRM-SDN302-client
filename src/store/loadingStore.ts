import { create } from 'zustand';

interface LoadingState {
  loading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
}

const useStoreLoading = create<LoadingState>(set => ({
  loading: false,
  showLoading: () => set({ loading: true }),
  hideLoading: () => set({ loading: false })
}));

export const useLoading = () => {
  const loading = useStoreLoading(state => state.loading);
  const showLoading = useStoreLoading(state => state.showLoading);
  const hideLoading = useStoreLoading(state => state.hideLoading);

  return { loading, showLoading, hideLoading };
};

export default useStoreLoading;
