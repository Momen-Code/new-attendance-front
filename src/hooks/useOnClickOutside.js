import { useEffect, useRef } from "react";

const useOnClickOutside = (onClickOutsideHandler) => {
  const componentRef = useRef(null);

  useEffect(() => {
    window.addEventListener("mouseup", handleContainer);

    return () => window.removeEventListener("mouseup", handleContainer);
  }, []);

  const handleContainer = (e) => {
    e.preventDefault();

    if (componentRef.current && !componentRef.current.contains(e.target)) {
      onClickOutsideHandler();
    }
  };

  return componentRef;
};

export default useOnClickOutside;
