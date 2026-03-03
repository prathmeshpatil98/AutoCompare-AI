import { create } from 'zustand';
import { CarListing } from '@/types/listing';

const MAX_COMPARE = 3;

interface CompareStore {
    cars: CarListing[];
    isOpen: boolean;
    addCar: (car: CarListing) => void;
    removeCar: (id: string) => void;
    clearAll: () => void;
    isAdded: (id: string) => boolean;
    toggleOpen: () => void;
    setOpen: (open: boolean) => void;
}

export const useCompareStore = create<CompareStore>((set, get) => ({
    cars: [],
    isOpen: false,

    addCar: (car) => {
        const { cars } = get();
        if (cars.length >= MAX_COMPARE || cars.find(c => c.id === car.id)) return;
        set({ cars: [...cars, car], isOpen: true });
    },

    removeCar: (id) => {
        const updated = get().cars.filter(c => c.id !== id);
        set({ cars: updated, isOpen: updated.length > 0 });
    },

    clearAll: () => set({ cars: [], isOpen: false }),

    isAdded: (id) => get().cars.some(c => c.id === id),

    toggleOpen: () => set(s => ({ isOpen: !s.isOpen })),
    setOpen: (open) => set({ isOpen: open }),
}));

export const MAX_COMPARE_CARS = MAX_COMPARE;
