import { create } from "zustand";

const storageKey = "puzzleHistory";
// first read of the localStorage
const getHistory = () => {
  try {
    const storage: string | any = localStorage.getItem(storageKey);
    return JSON.parse(storage);
  } catch (error) {
    return [];
  }
};

type HistoryRecord = {
  time: { seconds: number; minutes: number; hours: number };
  moves: number;
  size: number;
}[];
type IHistory = {
  history: HistoryRecord[];
  maxRecords: number;
  addNewRecord: (record: HistoryRecord) => void;
};

const useHistoryStore = create<IHistory>((set) => ({
  history: getHistory(),
  maxRecords: 0,
  addNewRecord: (record: HistoryRecord) =>
    set((state) => {
      const currHistory = [...state.history];
      if (currHistory.length >= state.maxRecords) {
        currHistory.shift();
      }
      currHistory.push(record);
      localStorage.setItem(storageKey, JSON.stringify(currHistory));
      return { history: currHistory };
    }),
}));

export { useHistoryStore };
export type { IHistory };
