"use client";

import {
  CastleTurret, Sparkle, Crown, Globe, FilmSlate,
  PawPrint, FilmStrip, VideoCamera, Anchor, Planet,
} from "@phosphor-icons/react";
import type { IconProps } from "@phosphor-icons/react";

const ICONS: Record<string, React.FC<IconProps>> = {
  Castle: CastleTurret,
  Sparkle, Crown, Globe, FilmSlate,
  Paw: PawPrint,
  FilmStrip, VideoCamera, Anchor, Planet,
};

interface ParkIconProps extends IconProps {
  name: string;
}

export default function ParkIcon({ name, ...props }: ParkIconProps) {
  const Icon = ICONS[name];
  if (!Icon) return null;
  return <Icon weight="duotone" {...props} />;
}
