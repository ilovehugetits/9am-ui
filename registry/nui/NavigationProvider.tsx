import React from "react"
import { create } from "zustand"

import { useNuiEvent } from "@/hooks/useNuiEvent"

/**
 * Which top-level page the NUI is showing.
 *
 * For a script with one screen and a row of tabs, local state is enough and
 * you do not need this. Reach for it when Lua decides what opens — a catalog
 * from one interaction, a dashboard from another, a HUD from a third — so the
 * client can send `setPage` and land the player in the right place.
 *
 * Page ids are plain strings; each script declares its own union:
 *
 * ```ts
 * type Page = "catalog" | "dashboard" | "hud"
 * const page = useNavigation().currentPage as Page
 * ```
 *
 * From Lua:
 *
 * ```lua
 * SendReactMessage('setPage', 'dashboard')
 * SetNuiVisible(true)
 * ```
 */
interface NavigationStore {
  currentPage: string
  setCurrentPage: (page: string) => void
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  currentPage: "",
  setCurrentPage: (page: string) => set({ currentPage: page }),
}))

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const setCurrentPage = useNavigationStore((s) => s.setCurrentPage)

  useNuiEvent<string>("setPage", setCurrentPage)

  return <>{children}</>
}

export const useNavigation = () => useNavigationStore()
