import React, { createContext, useContext, useState, useEffect } from 'react';

interface BucketlistContextType {
  bucketlist: string[];
  toggleBucketlist: (productId: string) => void;
  isInBucketlist: (productId: string) => boolean;
}

const BucketlistContext = createContext<BucketlistContextType | undefined>(undefined);

export const BucketlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bucketlist, setBucketlist] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('deadstock-bucketlist');
    if (stored) {
      try {
        setBucketlist(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse bucketlist', e);
      }
    }
  }, []);

  const toggleBucketlist = (productId: string) => {
    setBucketlist(prev => {
      const newBucketlist = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      localStorage.setItem('deadstock-bucketlist', JSON.stringify(newBucketlist));
      return newBucketlist;
    });
  };

  const isInBucketlist = (productId: string) => bucketlist.includes(productId);

  return (
    <BucketlistContext.Provider value={{ bucketlist, toggleBucketlist, isInBucketlist }}>
      {children}
    </BucketlistContext.Provider>
  );
};

export const useBucketlist = () => {
  const context = useContext(BucketlistContext);
  if (context === undefined) {
    throw new Error('useBucketlist must be used within a BucketlistProvider');
  }
  return context;
};
