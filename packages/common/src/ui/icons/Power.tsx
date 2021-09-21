import React from 'react';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

export const Power = (props: SvgIconProps): JSX.Element => {
  const combinedProps: SvgIconProps = { color: 'primary', ...props };
  return (
    <SvgIcon {...combinedProps} viewBox="0 0 20 20">
      <path d="M14.715 4.944c.325-.325.853-.325 1.179 0 3.253 3.255 3.253 8.53-.002 11.785-3.254 3.254-8.53 3.254-11.784 0C.853 13.475.853 8.199 4.106 4.944c.326-.325.854-.325 1.179 0 .325.325.326.853 0 1.178-2.603 2.604-2.602 6.825.001 9.428 2.604 2.603 6.824 2.603 9.428 0 2.603-2.603 2.604-6.824 0-9.428-.325-.325-.324-.853.001-1.178zm-4.71-4.11c.46 0 .832.372.832.833V10c0 .46-.373.833-.833.833-.46 0-.833-.373-.833-.833V1.667c0-.46.373-.834.833-.834z" />
    </SvgIcon>
  );
};
