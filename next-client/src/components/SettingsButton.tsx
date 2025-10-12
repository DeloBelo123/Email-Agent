"use client"

import { useState } from "react"
import { Settings } from "lucide-react"
import { SettingsDialog } from "./SettingsDialog"

export function SettingsButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsDialogOpen(true)}
        className="fixed top-4 right-4 z-40 p-3 bg-gray-blue/20 hover:bg-gray-blue/40 backdrop-blur-sm rounded-full transition-all duration-200 hover:scale-105"
      >
        <Settings className="w-6 h-6 text-creme-white" />
      </button>

      <SettingsDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  )
}
