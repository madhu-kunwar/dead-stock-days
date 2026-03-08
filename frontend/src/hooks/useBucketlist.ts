import { useState, useEffect } from 'react';

export const useBucketlist = () => {
  const [bucketlist, setBucketlist] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('deadstock-bucketlist');
    if (stored) {
      setBucketlist(JSON.parse(stored));
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

  return { bucketlist, toggleBucketlist, isInBucketlist };
};
