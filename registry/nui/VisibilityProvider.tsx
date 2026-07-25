import React, { useEffect } from "react";
import { useNuiEvent } from "@/hooks/useNuiEvent";
import { fetchNui } from "@/utils/fetchNui";
import { isEnvBrowser } from "@/utils/misc";
import { create } from "zustand";

interface VisibilityStore {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export const useVisibilityStore = create<VisibilityStore>((set) => ({
  visible: false,
  setVisible: (visible: boolean) => set({ visible }),
}));

export const VisibilityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { visible, setVisible } = useVisibilityStore();

  useNuiEvent<boolean>("setVisible", setVisible);

  useEffect(() => {
    if (!visible) return;

    const keyHandler = (e: KeyboardEvent) => {
      if (["Escape"].includes(e.code)) {
        if (!isEnvBrowser()) fetchNui("hideFrame");
        else setVisible(!visible);
      }
    };

    window.addEventListener("keydown", keyHandler);

    return () => window.removeEventListener("keydown", keyHandler);
  }, [visible, setVisible]);

  return (
    <div
      style={{ height: "100%" }}
      className={
        visible
          ? "opacity-100 transition-[opacity,transform] duration-200 ease-out"
          : "opacity-0 scale-[1.02] pointer-events-none invisible transition-[opacity,transform,visibility] duration-200 ease-in"
      }
    >
      {children}
    </div>
  );
};

export const useVisibility = () => useVisibilityStore();