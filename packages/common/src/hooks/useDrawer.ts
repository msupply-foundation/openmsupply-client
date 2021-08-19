import create from 'zustand';
import LocalStorage from '../localStorage/LocalStorage';

type DrawerController = {
  isOpen: boolean;
  hasUserSet: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

export const useDrawer = create<DrawerController>(set => {
  const initialValue = LocalStorage.getItem('/appdrawer/open');
  return {
    hasUserSet: initialValue !== null,
    isOpen: !!initialValue,
    open: () => set(state => ({ ...state, isOpen: true })),
    close: () => set(state => ({ ...state, isOpen: false })),
    toggle: () =>
      set(state => ({ ...state, isOpen: !state.isOpen, hasUserSet: true })),
  };
});

useDrawer.subscribe(({ hasUserSet, isOpen }) => {
  if (hasUserSet) LocalStorage.setItem('/appdrawer/open', isOpen);
});

LocalStorage.addListener<boolean>((key, value) => {
  if (key === '/appdrawer/open') {
    useDrawer.setState(state => ({ ...state, isOpen: value }));
  }
});
