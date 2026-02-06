/**
 * Dialog Context
 * Global dialog management for neubrutalism-styled dialogs
 */

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Dialog, DialogButton } from '@components/ui/Dialog';

interface DialogState {
  visible: boolean;
  title: string;
  message?: string;
  buttons: DialogButton[];
}

interface DialogContextValue {
  alert: (title: string, message?: string, buttons?: DialogButton[]) => void;
  confirm: (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => void;
  hide: () => void;
}

const DialogContext = createContext<DialogContextValue | undefined>(undefined);

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within DialogProvider');
  }
  return context;
};

interface DialogProviderProps {
  children: ReactNode;
}

export const DialogProvider: React.FC<DialogProviderProps> = ({ children }) => {
  const [dialogState, setDialogState] = useState<DialogState>({
    visible: false,
    title: '',
    message: undefined,
    buttons: [],
  });

  const hide = useCallback(() => {
    setDialogState((prev) => ({ ...prev, visible: false }));
  }, []);

  const alert = useCallback(
    (title: string, message?: string, buttons?: DialogButton[]) => {
      setDialogState({
        visible: true,
        title,
        message,
        buttons: buttons || [{ text: 'OK', style: 'default' }],
      });
    },
    []
  );

  const confirm = useCallback(
    (
      title: string,
      message: string,
      onConfirm: () => void,
      onCancel?: () => void
    ) => {
      setDialogState({
        visible: true,
        title,
        message,
        buttons: [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: onCancel,
          },
          {
            text: 'Confirm',
            style: 'default',
            onPress: onConfirm,
          },
        ],
      });
    },
    []
  );

  const value: DialogContextValue = {
    alert,
    confirm,
    hide,
  };

  return (
    <DialogContext.Provider value={value}>
      {children}
      <Dialog
        visible={dialogState.visible}
        title={dialogState.title}
        message={dialogState.message}
        buttons={dialogState.buttons}
        onClose={hide}
      />
    </DialogContext.Provider>
  );
};
