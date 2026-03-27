import { useEffect, useState } from 'react';
import { normalizePath } from './routeUtils';
import type { AppPath } from './types';

export function useAppRouter() {
  const [currentPath, setCurrentPath] = useState<AppPath>(() =>
    normalizePath(window.location.pathname, window.location.search),
  );
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleWindowScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname, window.location.search));
      handleWindowScroll();
    };

    window.addEventListener('scroll', handleWindowScroll);
    window.addEventListener('popstate', handlePopState);
    handleWindowScroll();

    return () => {
      window.removeEventListener('scroll', handleWindowScroll);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    if (`${window.location.pathname}${window.location.search}` !== currentPath) {
      window.history.replaceState({}, '', currentPath);
    }
  }, [currentPath]);

  const navigate = (path: AppPath, smoothScroll = true) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
    }
    if (smoothScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return {
    currentPath,
    isScrolled,
    navigate,
  };
}
