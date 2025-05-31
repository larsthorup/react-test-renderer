// Compatibility layer for React Reconciler

type FormStatusNotPending = {
  pending: false;
  data: null;
  method: null;
  action: null;
};

type FormStatusPending = {
  pending: true;
  data: FormData;
  method: string;
  action: string | ((data: FormData) => void | Promise<void>) | null;
};

type FormStatus = FormStatusPending | FormStatusNotPending;
export type TransitionStatus = FormStatus;
