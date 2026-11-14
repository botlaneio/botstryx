'use client';

import {IconButton} from '@astryxdesign/core/IconButton';

import {useColorMode} from '@/app/providers';
import {Moon, Sun} from '@/components/icons';

/** Switches between the light and dark themes. Shows the moon in light, the sun in dark. */
export function ThemeToggle() {
  const {mode, toggle} = useColorMode();
  return (
    <IconButton
      label="Switch between light and dark"
      tooltip="Light or dark"
      variant="ghost"
      onClick={toggle}
      icon={mode === 'dark' ? <Sun /> : <Moon />}
    />
  );
}
