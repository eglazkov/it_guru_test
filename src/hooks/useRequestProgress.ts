import { useEffect, useState } from "react";

const useServerProgress = (isLoading: boolean) => {
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setShowProgress(true);

      let frame: number;
      const animate = () => {
        setProgress((prev) => Math.min(prev + 1.2, 95));
        frame = requestAnimationFrame(animate);
      };
      animate();

      return () => cancelAnimationFrame(frame);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading && showProgress && progress < 100) {
      let frame: number;
      const animateFinish = () => {
        setProgress((prev) => {
          const next = Math.min(prev + 2.5, 100);
          if (next < 100) {
            frame = requestAnimationFrame(animateFinish);
          } else {
            setTimeout(() => setShowProgress(false), 300);
          }
          return next;
        });
      };
      animateFinish();

      return () => cancelAnimationFrame(frame);
    }
  }, [isLoading, showProgress, progress]);

  return { progress, showProgress };
};

export default useServerProgress;
