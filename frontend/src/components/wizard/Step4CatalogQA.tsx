'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { useWizardStore } from '@/store/useWizardStore';
import { Check, Plus, ChevronRight, ChevronLeft, Sparkles, Layers, Box, CheckSquare, PlusCircle } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  code?: string;
  description?: string;
}

interface ProductTypeItem {
  id: string;
  name: string;
  description?: string;
}

interface MainModuleItem {
  id: string;
  name: string;
}

interface SubModuleItem {
  id: string;
  name: string;
  options: { id: string; name: string; is_custom?: boolean }[];
}

export function Step4CatalogQA() {
  const { selectionTree, updateSelectionTree } = useWizardStore();
  const savedTree = selectionTree.step_4_catalog_tree || {};

  // Internal Q&A Screen state: 'category' | 'type' | 'module' | 'options'
  const [qaScreen, setQaScreen] = useState<'category' | 'type' | 'module' | 'options'>('category');

  // Available options fetched from backend
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(savedTree.category || null);

  const [types, setTypes] = useState<ProductTypeItem[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(savedTree.type_ids || []);

  const [modules, setModules] = useState<MainModuleItem[]>([]);
  const [selectedModules, setSelectedModules] = useState<string[]>(savedTree.module_ids || []);

  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [subModuleData, setSubModuleData] = useState<SubModuleItem[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>(savedTree.selected_options || {});

  // Custom option input state
  const [customInput, setCustomInput] = useState<Record<string, string>>({});
  const [addingCustomForSub, setAddingCustomForSub] = useState<string | null>(null);

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      const res = await apiFetch('/catalog/categories');
      if (res.data?.categories) {
        setCategories(res.data.categories);
      }
    }
    loadCategories();
  }, []);

  // Load types when selected category changes
  useEffect(() => {
    if (selectedCategory) {
      apiFetch(`/catalog/categories/${selectedCategory.id}/types`).then((res) => {
        if (res.data?.types) setTypes(res.data.types);
      });
    }
  }, [selectedCategory]);

  // Load modules when selected types change
  useEffect(() => {
    if (selectedTypes.length > 0) {
      Promise.all(selectedTypes.map((typeId) => apiFetch(`/catalog/types/${typeId}/modules`))).then((results) => {
        const allMods: MainModuleItem[] = [];
        results.forEach((res) => {
          if (res.data?.mainModules) allMods.push(...res.data.mainModules);
        });
        setModules(allMods);
      });
    }
  }, [selectedTypes]);

  // Load sub-modules for current active main module
  const currentModule = modules[activeModuleIndex];
  useEffect(() => {
    if (currentModule) {
      apiFetch(`/catalog/modules/${currentModule.id}/submodules`).then((res) => {
        if (res.data?.subModules) {
          setSubModuleData(res.data.subModules);
        }
      });
    }
  }, [currentModule]);

  // Sync selection tree to Zustand store whenever state updates
  useEffect(() => {
    updateSelectionTree('step_4_catalog_tree', {
      category: selectedCategory,
      type_ids: selectedTypes,
      module_ids: selectedModules,
      selected_options: selectedOptions,
    });
  }, [selectedCategory, selectedTypes, selectedModules, selectedOptions, updateSelectionTree]);

  const toggleType = (id: string) => {
    setSelectedTypes((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  };

  const toggleModule = (id: string) => {
    setSelectedModules((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]));
  };

  const toggleOption = (subModuleId: string, optionName: string) => {
    setSelectedOptions((prev) => {
      const existing = prev[subModuleId] || [];
      const updated = existing.includes(optionName)
        ? existing.filter((o) => o !== optionName)
        : [...existing, optionName];
      return { ...prev, [subModuleId]: updated };
    });
  };

  const handleAddCustomOption = async (subModuleId: string) => {
    const optionName = customInput[subModuleId]?.trim();
    if (!optionName) return;

    setAddingCustomForSub(subModuleId);
    const res = await apiFetch('/catalog/custom', {
      method: 'POST',
      body: JSON.stringify({
        sub_module_id: subModuleId,
        custom_option_name: optionName,
      }),
    });
    setAddingCustomForSub(null);

    if (res.data?.option) {
      // Add custom option to local state & select it automatically
      setSubModuleData((prev) =>
        prev.map((sub) =>
          sub.id === subModuleId ? { ...sub, options: [...sub.options, res.data.option] } : sub
        )
      );
      toggleOption(subModuleId, res.data.option.name);
      setCustomInput((prev) => ({ ...prev, [subModuleId]: '' }));
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Q&A Navigation Header */}
      <div className="border-b border-ink-border pb-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono text-cobalt font-semibold uppercase tracking-widest block mb-1">
            STEP 4 OF 12 // PRODUCT CATALOG Q&A WIZARD
          </span>
          <h2 className="text-2xl font-bold font-display text-ink">
            {qaScreen === 'category' && 'Question 1: Product Category Selection'}
            {qaScreen === 'type' && 'Question 2: Product Type Selection'}
            {qaScreen === 'module' && 'Question 3: Main Modules Selection'}
            {qaScreen === 'options' && `Question 4: Sub-Module Options (${activeModuleIndex + 1}/${modules.length})`}
          </h2>
        </div>

        {/* Screen Indicator */}
        <div className="flex items-center gap-2 font-mono text-xs text-ink-muted">
          <button
            onClick={() => {
              if (qaScreen === 'type') setQaScreen('category');
              if (qaScreen === 'module') setQaScreen('type');
              if (qaScreen === 'options') {
                if (activeModuleIndex > 0) setActiveModuleIndex(activeModuleIndex - 1);
                else setQaScreen('module');
              }
            }}
            disabled={qaScreen === 'category'}
            className="p-1.5 rounded hover:bg-paper disabled:opacity-30 disabled:cursor-not-allowed border border-ink-border"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span>Screen {qaScreen === 'category' ? 1 : qaScreen === 'type' ? 2 : qaScreen === 'module' ? 3 : 4 + activeModuleIndex}</span>
        </div>
      </div>

      {/* SCREEN 1: CATEGORY SELECTION */}
      {qaScreen === 'category' && (
        <div className="space-y-6">
          <div className="bg-paper p-4 rounded border border-ink-border text-xs font-mono text-ink-muted">
            <span className="font-semibold text-ink uppercase block mb-1">{"// QUESTION 1 OF CATALOG WIZARD"}</span>
            <p>Which primary Product Category best describes your software platform application?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat) => {
              const isSelected = selectedCategory?.id === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat)}
                  className={`p-5 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-cobalt-light border-cobalt shadow-sm'
                      : 'bg-white border-ink-border hover:border-ink'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-paper text-ink-muted border border-ink-border">
                        {cat.code || 'CAT'}
                      </span>
                      <h3 className="font-display font-bold text-base text-ink mt-2">{cat.name}</h3>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-cobalt shrink-0" />}
                  </div>
                  {cat.description && (
                    <p className="text-xs text-ink-muted mt-3 font-sans leading-relaxed">
                      {cat.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4 border-t border-ink-border">
            <button
              disabled={!selectedCategory}
              onClick={() => setQaScreen('type')}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-cobalt hover:bg-cobalt-hover text-white text-xs font-mono font-semibold rounded shadow-sm disabled:opacity-40 transition-all"
            >
              <span>Next: Select Product Types</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 2: PRODUCT TYPE SELECTION */}
      {qaScreen === 'type' && (
        <div className="space-y-6">
          <div className="bg-paper p-4 rounded border border-ink-border text-xs font-mono text-ink-muted">
            <span className="font-semibold text-ink uppercase block mb-1">
              {`// QUESTION 2 FOR ${selectedCategory?.name.toUpperCase()}`}
            </span>
            <p>Which Product Types apply to your software scope? (Select all that apply)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {types.map((type) => {
              const isSelected = selectedTypes.includes(type.id);
              return (
                <div
                  key={type.id}
                  onClick={() => toggleType(type.id)}
                  className={`p-5 rounded-lg border cursor-pointer transition-all flex items-start justify-between ${
                    isSelected
                      ? 'bg-cobalt-light border-cobalt shadow-sm'
                      : 'bg-white border-ink-border hover:border-ink'
                  }`}
                >
                  <div>
                    <h3 className="font-display font-bold text-sm text-ink">{type.name}</h3>
                    {type.description && (
                      <p className="text-xs text-ink-muted mt-1.5 font-sans leading-relaxed">
                        {type.description}
                      </p>
                    )}
                  </div>
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-cobalt border-cobalt text-white' : 'border-ink-border'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-ink-border">
            <button
              onClick={() => setQaScreen('category')}
              className="px-4 py-2 bg-paper hover:bg-white text-ink border border-ink-border text-xs font-mono font-medium rounded transition-all"
            >
              Back to Categories
            </button>

            <button
              disabled={selectedTypes.length === 0}
              onClick={() => setQaScreen('module')}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-cobalt hover:bg-cobalt-hover text-white text-xs font-mono font-semibold rounded shadow-sm disabled:opacity-40 transition-all"
            >
              <span>Next: Select Main Modules</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 3: MAIN MODULES SELECTION */}
      {qaScreen === 'module' && (
        <div className="space-y-6">
          <div className="bg-paper p-4 rounded border border-ink-border text-xs font-mono text-ink-muted">
            <span className="font-semibold text-ink uppercase block mb-1">{"// QUESTION 3 OF CATALOG WIZARD"}</span>
            <p>Which Main Modules are required for your platform architecture? (Select all that apply)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {modules.map((mod) => {
              const isSelected = selectedModules.includes(mod.id);
              return (
                <div
                  key={mod.id}
                  onClick={() => toggleModule(mod.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-cobalt-light border-cobalt shadow-sm'
                      : 'bg-white border-ink-border hover:border-ink'
                  }`}
                >
                  <span className="font-display font-semibold text-sm text-ink">{mod.name}</span>
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-cobalt border-cobalt text-white' : 'border-ink-border'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-ink-border">
            <button
              onClick={() => setQaScreen('type')}
              className="px-4 py-2 bg-paper hover:bg-white text-ink border border-ink-border text-xs font-mono font-medium rounded transition-all"
            >
              Back to Product Types
            </button>

            <button
              disabled={selectedModules.length === 0}
              onClick={() => {
                setActiveModuleIndex(0);
                setQaScreen('options');
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-cobalt hover:bg-cobalt-hover text-white text-xs font-mono font-semibold rounded shadow-sm disabled:opacity-40 transition-all"
            >
              <span>Next: Configure Sub-Module Options</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 4..N: SUB-MODULES & FEATURE OPTIONS PER MAIN MODULE */}
      {qaScreen === 'options' && currentModule && (
        <div className="space-y-6">
          <div className="bg-paper p-4 rounded border border-ink-border text-xs font-mono text-ink-muted flex items-center justify-between">
            <div>
              <span className="font-semibold text-cobalt uppercase block mb-1">
                {`// MODULE ${activeModuleIndex + 1} OF ${modules.length}: ${currentModule.name.toUpperCase()}`}
              </span>
              <p>Select feature options or add custom sub-module options for this module.</p>
            </div>
            <span className="text-xs font-bold text-ink bg-white px-3 py-1 rounded border border-ink-border">
              {activeModuleIndex + 1} / {modules.length}
            </span>
          </div>

          <div className="space-y-6">
            {subModuleData.map((sub) => {
              const currentSelected = selectedOptions[sub.id] || [];
              const isAddingCustom = addingCustomForSub === sub.id;

              return (
                <div key={sub.id} className="bg-white border border-ink-border rounded-lg p-6 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-ink-border/60 pb-3">
                    <span className="font-display font-bold text-base text-ink flex items-center gap-2">
                      <Box className="w-4 h-4 text-cobalt" />
                      {sub.name}
                    </span>
                    <span className="text-[10px] font-mono text-ink-muted">
                      {currentSelected.length} option(s) selected
                    </span>
                  </div>

                  {/* Standard & Custom Options Checkbox List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {sub.options.map((opt) => {
                      const isChecked = currentSelected.includes(opt.name);
                      return (
                        <div
                          key={opt.id}
                          onClick={() => toggleOption(sub.id, opt.name)}
                          className={`p-3 rounded border cursor-pointer text-xs font-mono transition-all flex items-center justify-between ${
                            isChecked
                              ? 'bg-cobalt-light border-cobalt text-cobalt font-semibold'
                              : 'bg-paper border-ink-border text-ink hover:border-ink'
                          }`}
                        >
                          <span className="truncate pr-2">
                            {opt.name} {opt.is_custom && <span className="text-[9px] text-amber-600 font-bold">(Custom)</span>}
                          </span>
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                              isChecked ? 'bg-cobalt border-cobalt text-white' : 'border-ink-border bg-white'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Inline Client Custom Option Add Input */}
                  <div className="pt-3 border-t border-ink-border/40 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="+ Type custom feature option name..."
                      value={customInput[sub.id] || ''}
                      onChange={(e) => setCustomInput((prev) => ({ ...prev, [sub.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddCustomOption(sub.id);
                      }}
                      className="flex-1 px-3 py-1.5 bg-paper text-ink text-xs border border-ink-border rounded font-sans focus:outline-none focus:ring-1 focus:ring-cobalt"
                    />
                    <button
                      onClick={() => handleAddCustomOption(sub.id)}
                      disabled={isAddingCustom || !customInput[sub.id]?.trim()}
                      className="px-3 py-1.5 bg-cobalt hover:bg-cobalt-hover text-white text-xs font-mono font-semibold rounded disabled:opacity-40 transition-all inline-flex items-center gap-1.5"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>{isAddingCustom ? 'Adding...' : 'Add Custom'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-ink-border">
            <button
              onClick={() => {
                if (activeModuleIndex > 0) setActiveModuleIndex(activeModuleIndex - 1);
                else setQaScreen('module');
              }}
              className="px-4 py-2 bg-paper hover:bg-white text-ink border border-ink-border text-xs font-mono font-medium rounded transition-all"
            >
              Previous Module
            </button>

            {activeModuleIndex < modules.length - 1 ? (
              <button
                onClick={() => setActiveModuleIndex(activeModuleIndex + 1)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-cobalt hover:bg-cobalt-hover text-white text-xs font-mono font-semibold rounded shadow-sm transition-all"
              >
                <span>Next Module ({activeModuleIndex + 2}/{modules.length})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <span className="text-xs font-mono text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200">
                ✓ Catalog Q&A Selection Complete (Proceed to Step 5)
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
