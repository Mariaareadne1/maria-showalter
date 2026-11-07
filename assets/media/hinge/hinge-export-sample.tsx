'use client'

import type { ReactNode } from 'react'
import { useHinge, type UseHingeOptions } from './hinge/useHinge'
import type { HingeBehavior } from './hinge/runtime'
// Tuned in Hinge — "Lift Card".
const BEHAVIOR: HingeBehavior = {
  hover: {
    pose: {
      y: -10,
      scale: 1.02,
      rotate: 0,
      lift: 1
    },
    spring: {
      stiffness: 170,
      damping: 18,
      mass: 1.2
    }
  },
  press: {
    pose: {
      y: -3,
      scale: 0.98,
      rotate: 0,
      lift: 0.45
    },
    spring: {
      stiffness: 420,
      damping: 30,
      mass: 1
    }
  },
  drag: {
    enabled: true,
    axis: 'both',
    radius: 120,
    elasticity: 0.35,
    scale: 1.04,
    lift: 1,
    tilt: 6,
    spring: {
      stiffness: 320,
      damping: 6,
      mass: 1.2
    }
  }
}
import './hinge-card.css'

export interface HingeCardProps extends UseHingeOptions {
  behavior?: HingeBehavior
  eyebrow?: string
  title?: string
  children?: ReactNode
  /** accessible name; defaults to the title */
  label?: string
}

export function HingeCard({
  behavior = BEHAVIOR,
  eyebrow = 'No. 01 — Object study',
  title = 'Porcelain',
  children = 'Hover to lift it, press to seat it, drag it and let go.',
  label,
  ...options
}: HingeCardProps) {
  const ref = useHinge<HTMLDivElement>(behavior, options)
  return (
    <div
      ref={ref}
      className="hinge-card"
      role="button"
      tabIndex={0}
      aria-label={label ?? title}
      aria-roledescription={behavior.drag.enabled ? 'draggable card' : undefined}
      style={{ touchAction: behavior.drag.enabled ? 'none' : 'manipulation' }}
    >
      <div className="hinge-card__plate" aria-hidden="true">
        <svg viewBox="0 0 120 80" className="hinge-card__mark">
          <circle cx="60" cy="40" r="26" />
          <circle cx="60" cy="40" r="16" />
          <path d="M18 66 L102 14" />
          <circle cx="60" cy="40" r="3" className="hinge-card__pin" />
        </svg>
      </div>
      <p className="hinge-card__eyebrow">{eyebrow}</p>
      <p className="hinge-card__title">{title}</p>
      <p className="hinge-card__body">{children}</p>
    </div>
  )
}
