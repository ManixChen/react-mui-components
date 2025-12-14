import React, { createContext, useContext, useEffect, useState } from 'react';
import ConfirmDialog from './ConfirmDialog';
import { DynamicDialogProps, DynamicContextType } from './types';

const DialogContext = createContext<DynamicContextType | null>(null);

interface DynamicDialogProviderProps {
  children?: React.ReactElement;
}

const DynamicDialogProvider: React.FC<DynamicDialogProviderProps> = ({ children }) => {
  const [confirmProps, setConfirmProps] = useState<DynamicDialogProps | null>(null);

  const openModal = (props: DynamicDialogProps) => {
    setConfirmProps({ ...props, ...{ isModal: true } });
    return closeModal;
  };

  const closeModal = () => {
    setConfirmProps(null);
  };

  const handleCancel = () => {
    closeModal();
    confirmProps?.onCancel && confirmProps?.onCancel();
  };

  const handleConfirm = () => {
    closeModal();
    confirmProps?.onConfirm && confirmProps?.onConfirm();
  };

  useEffect(() => {
    setConfirmProps(confirmProps);
  }, [confirmProps]);

  return (
    <DialogContext.Provider value={{ openModal, closeModal }}>
      {children}
      <ConfirmDialog
        maxWidth={confirmProps?.maxWidth}
        open={!!confirmProps}
        onCancel={confirmProps?.onCancel && handleCancel}
        confirmColor={confirmProps?.confirmColor}
        onConfirm={confirmProps?.onConfirm && handleConfirm}
        confirmText={confirmProps?.confirmText}
        cancelText={confirmProps?.cancelText}
        title={confirmProps?.title}
        content={confirmProps?.content}
        message={confirmProps?.message}
        messageCh={confirmProps?.messageCh}
        messageEn={confirmProps?.messageEn}
        isModal={confirmProps?.isModal}
      />
    </DialogContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useModal must be used within a DynamicDialogProvider');
  }
  return context;
};

export { DynamicDialogProvider };
export default DynamicDialogProvider;

