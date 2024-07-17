import React, {createContext, useContext, useState, ReactNode} from 'react';

type Player = {
  name: string;
  score: number;
};

type RankingContextType = {
  data: Player[];
  addPlayer: (name: string, score: number) => void;
};

const initialData: Player[] = [
  {name: 'Player1', score: 95},
  {name: 'Player2', score: 88},
  {name: 'Player3', score: 92},
  {name: 'Player4', score: 80},
  {name: 'Player5', score: 85},
  {name: 'Player6', score: 90},
  {name: 'Player7', score: 83},
  {name: 'Player8', score: 79},
  {name: 'Player9', score: 75},
  {name: 'Player10', score: 70},
];

const RankingContext = createContext<RankingContextType | undefined>(undefined);

export const useRanking = () => {
  const context = useContext(RankingContext);
  if (!context) {
    throw new Error('useRanking must be used within a RankingProvider');
  }
  return context;
};

type RankingProviderProps = {
  children: ReactNode;
};

export const RankingProvider = ({children}: RankingProviderProps) => {
  const [data, setData] = useState<Player[]>(initialData);

  const addPlayer = (name: string, score: number) => {
    const newData = [...data, {name, score}];
    newData.sort((a, b) => b.score - a.score);
    setData(newData.slice(0, 10));
  };

  return (
    <RankingContext.Provider value={{data, addPlayer}}>
      {children}
    </RankingContext.Provider>
  );
};
