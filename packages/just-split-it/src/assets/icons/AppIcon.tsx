import React from 'react';
// @ts-ignore
import { ReactComponent as JLightIcon } from '@/assets/icons/j-light.svg';
// @ts-ignore
import { ReactComponent as JDarkIcon } from '@/assets/icons/j-dark.svg';
import SvgResizer from 'react-svg-resizer';
import { DarkTheme, LightTheme } from '@/theme/Theme';

interface AppIconProps {
  size: number;
}

const AppIcon = (props: AppIconProps) => {
  return (
    <SvgResizer size={props.size}>
      <LightTheme>
        <JDarkIcon />
      </LightTheme>
      <DarkTheme>
        <JLightIcon />
      </DarkTheme>
    </SvgResizer>
  );
};

export default AppIcon;
