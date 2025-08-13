import { createContext, useContext, ReactNode, useState } from 'react';

interface DragDropContextValue {
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  draggedImageId: string | null;
  setDraggedImageId: (id: string | null) => void;
}

const DragDropContext = createContext<DragDropContextValue | null>(null);

export function useDragDrop() {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error('useDragDrop must be used within DragDropProvider');
  }
  return context;
}

interface DragDropProviderProps {
  children: ReactNode;
}

export function DragDropProvider({ children }: DragDropProviderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedImageId, setDraggedImageId] = useState<string | null>(null);

  const value: DragDropContextValue = {
    isDragging,
    setIsDragging,
    draggedImageId,
    setDraggedImageId
  };

  return (
    <DragDropContext.Provider value={value}>
      {children}
    </DragDropContext.Provider>
  );
}