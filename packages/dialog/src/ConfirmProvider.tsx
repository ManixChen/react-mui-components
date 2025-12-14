import React, { createContext, Fragment, useContext, useState } from 'react';
import ConfirmDialog from './ConfirmDialog';
import { ConfirmDialogContextProps, ConfirmContextType } from './types';

export const ConfirmContext = createContext<ConfirmContextType>({
  openConfirm: () => {},
});

interface ConfirmProviderProps {
  children: React.ReactNode;
}

const ConfirmProvider: React.FC<ConfirmProviderProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [confirmProps, setConfirmProps] = useState<ConfirmDialogContextProps>({ title: '' });

  const openConfirm = (props: ConfirmDialogContextProps) => {
    setConfirmProps(props);
    setOpen(true);
  };

  const closeConfirm = () => {
    setOpen(false);
    setConfirmProps({ title: '' });
  };

  const handleCancel = () => {
    closeConfirm();
    confirmProps?.onCancel && confirmProps?.onCancel();
  };

  const handleConfirm = () => {
    closeConfirm();
    confirmProps?.onConfirm && confirmProps?.onConfirm();
  };

  return (
    <Fragment>
      <ConfirmContext.Provider value={{ openConfirm }}>
        {children}
      </ConfirmContext.Provider>
      <ConfirmDialog
        open={open}
        onCancel={handleCancel}
        confirmColor={confirmProps?.confirmColor}
        onConfirm={handleConfirm}
        title={confirmProps?.title}
        message={confirmProps?.message}
        messageCh={confirmProps?.messageCh}
        messageEn={confirmProps?.messageEn}
        maxWidth={confirmProps?.maxWidth}
        isModal={confirmProps?.isModal}
      />
    </Fragment>
  );
};

export const useConfirm = () => useContext(ConfirmContext);

export default ConfirmProvider;

