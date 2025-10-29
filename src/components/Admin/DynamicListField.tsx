'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import Input from '@/components/UI/Input';

interface DynamicListFieldProps {
  label: string;
  items: string[];
  onItemsChange: (items: string[]) => void;
  placeholder?: string;
  error?: string;
  helpText?: string;
  maxItems?: number;
  required?: boolean;
}

export default function DynamicListField({
  label,
  items,
  onItemsChange,
  placeholder = 'Digite um item...',
  error,
  helpText,
  maxItems = 10,
  required = false,
}: DynamicListFieldProps) {
  const [newItem, setNewItem] = useState('');

  const handleAddItem = () => {
    const trimmedItem = newItem.trim();
    if (trimmedItem && items.length < maxItems) {
      onItemsChange([...items, trimmedItem]);
      setNewItem('');
    }
  };

  const handleRemoveItem = (index: number) => {
    onItemsChange(items.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {helpText && <p className="text-xs text-foreground/60">{helpText}</p>}

      {/* Lista de itens */}
      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-3 bg-accent/5 border-2 border-accent/20 rounded-lg group"
            >
              <span className="flex-1 text-sm text-foreground">{item}</span>
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                aria-label={`Remover item ${index + 1}`}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Campo de input para adicionar novo item */}
      {items.length < maxItems && (
        <div className="flex gap-2">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="flex-1"
          />
          <button
            type="button"
            onClick={handleAddItem}
            disabled={!newItem.trim()}
            className="px-4 py-2 bg-accent text-background rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            aria-label="Adicionar item"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Adicionar</span>
          </button>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}

      {items.length === 0 && (
        <p className="text-xs text-foreground/50 italic">
          Nenhum item adicionado ainda.
        </p>
      )}

      {items.length >= maxItems && (
        <p className="text-xs text-amber-600">
          Limite máximo de {maxItems} itens atingido.
        </p>
      )}
    </div>
  );
}
