import { create } from 'zustand';
import { apiFetch } from '@/lib/api';

export type AutosaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface WizardState {
  frdId: string | null;
  currentStep: number;
  selectionTree: Record<string, any>;
  templateSections: Record<string, any>;
  autosaveStatus: AutosaveStatus;
  lastSavedAt: string | null;

  initWizard: (frdId: string, initialSelection: Record<string, any>, templateSections?: Record<string, any>) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateSelectionTree: (stepKey: string, stepData: Record<string, any>) => void;
  saveSelections: () => Promise<void>;
}

let autosaveTimer: NodeJS.Timeout | null = null;

export const useWizardStore = create<WizardState>((set, get) => ({
  frdId: null,
  currentStep: 1,
  selectionTree: {},
  templateSections: {},
  autosaveStatus: 'idle',
  lastSavedAt: null,

  initWizard: (frdId, initialSelection, templateSections = {}) => {
    set({
      frdId,
      selectionTree: initialSelection || {},
      templateSections: templateSections || {},
      currentStep: 1,
      autosaveStatus: 'saved',
    });
  },

  setStep: (step) => {
    if (step >= 1 && step <= 13) {
      set({ currentStep: step });
    }
  },

  nextStep: () => {
    const { currentStep } = get();
    if (currentStep < 13) {
      set({ currentStep: currentStep + 1 });
      get().saveSelections();
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: currentStep - 1 });
    }
  },

  updateSelectionTree: (stepKey, stepData) => {
    const { selectionTree, frdId } = get();
    const updatedTree = {
      ...selectionTree,
      [stepKey]: {
        ...(selectionTree[stepKey] || {}),
        ...stepData,
      },
    };

    set({ selectionTree: updatedTree, autosaveStatus: 'saving' });

    // Debounce autosave (~10s)
    if (autosaveTimer) clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(() => {
      if (frdId) {
        get().saveSelections();
      }
    }, 10000);
  },

  saveSelections: async () => {
    const { frdId, selectionTree } = get();
    if (!frdId) return;

    set({ autosaveStatus: 'saving' });
    const res = await apiFetch(`/frds/${frdId}/selections`, {
      method: 'PUT',
      body: JSON.stringify({ selection_tree: selectionTree }),
    });

    if (res.error) {
      set({ autosaveStatus: 'error' });
    } else {
      set({ autosaveStatus: 'saved', lastSavedAt: new Date().toLocaleTimeString() });
    }
  },
}));
