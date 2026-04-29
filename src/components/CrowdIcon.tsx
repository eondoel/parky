"use client";

import { Moon, SunDim, Sun, Lightning, Fire } from "@phosphor-icons/react";
import type { IconProps } from "@phosphor-icons/react";

export const CROWD_ICON_NAMES: Record<string, string> = {
  "very-low": "Moon",
  "low":      "SunDim",
  "moderate": "Sun",
  "high":     "Lightning",
  "very-high":"Fire",
};

const ICONS: Record<string, React.FC<IconProps>> = {
  Moon, SunDim, Sun, Lightning, Fire,
};

interface CrowdIconProps extends IconProps {
  level: string;
}

export default function CrowdIcon({ level, ...props }: CrowdIconProps) {
  const Icon = ICONS[CROWD_ICON_NAMES[level] ?? "Sun"];
  if (!Icon) return null;
  return <Icon weight="duotone" {...props} />;
}
