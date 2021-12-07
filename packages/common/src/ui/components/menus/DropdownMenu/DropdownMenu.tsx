import React, { FC } from 'react';
import {
  MenuItem,
  MenuItemProps,
  FormControl,
  Select,
  InputLabel,
  outlinedInputClasses,
  Box,
  SvgIconProps,
  ListItemText,
  styled,
} from '@mui/material';

import { ChevronDownIcon } from '@common/icons';

interface DropdownMenuItemProps extends MenuItemProps {
  IconComponent?: React.JSXElementConstructor<SvgIconProps>;
  inset?: boolean;
  color?: 'primary' | 'secondary';
}

export const DropdownMenuItem: FC<DropdownMenuItemProps> = ({
  IconComponent,
  color,
  ...props
}) => {
  return (
    <MenuItem sx={{ fontSize: '10' }} {...props}>
      {IconComponent ? (
        <Box mr={1}>
          <IconComponent fontSize="inherit" color={color} />
        </Box>
      ) : null}
      <ListItemText
        inset={props.inset}
        primaryTypographyProps={{ color, sx: { fontSize: 'inherit' } }}
        sx={{
          '&.MuiListItemText-inset': { paddingLeft: '22px' },
        }}
      >
        {props.children}
      </ListItemText>
    </MenuItem>
  );
};

const StyledSelect = styled(Select)(({ theme }) => ({
  borderRadius: '8px',
  width: 160,
  backgroundColor: 'white',
  '& .MuiSelect-icon': {
    // If left is not explicitly defined, sometimes the icon floats to the left
    left: 'calc(100% - 30px)',
    color: theme.palette.primary.main,
  },

  [`& .${outlinedInputClasses.notchedOutline}`]: {
    borderColor: theme.palette.border,
  },
  [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
    borderColor: theme.palette.border,
  },

  [`&.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
    {
      borderColor: theme.palette.gray.dark,
    },
}));

interface DropdownMenuProps {
  label: string;
  disabled?: boolean;
}

// Styled doesn't like `sx` prop being passed to it.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const DropdownMenu: FC<DropdownMenuProps> = ({
  label,
  children,
  disabled = false,
}) => {
  return (
    <FormControl size="small">
      <InputLabel
        shrink={false}
        sx={{ color: '#8f90a6', '&.Mui-focused': { color: '#8f90a6' } }}
        id={`action-drop-down-label-${label}`}
      >
        {label}
      </InputLabel>
      <StyledSelect
        disabled={disabled}
        value=""
        size="small"
        labelId={`action-drop-down-label-${label}`}
        variant="outlined"
        IconComponent={ChevronDownIcon}
      >
        {children}
      </StyledSelect>
    </FormControl>
  );
};
