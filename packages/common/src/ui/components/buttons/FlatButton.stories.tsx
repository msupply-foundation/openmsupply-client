import React from 'react';
import { Box } from '@mui/material';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FlatButton } from './FlatButton';
import { BookIcon, FilterIcon } from '@common/icons';

const Template: ComponentStory<typeof FlatButton> = args => (
  <Box>
    <FlatButton
      {...args}
      startIcon={<BookIcon color={args.color} />}
      label="Docs"
      onClick={() => console.info('clicked')}
    />
  </Box>
);

const StyledTemplate: ComponentStory<typeof FlatButton> = args => (
  <Box>
    <FlatButton
      {...args}
      endIcon={<FilterIcon fontSize="small" />}
      label="View Filters"
      onClick={() => console.info('clicked')}
      sx={{
        color: 'gray.main',
        fontSize: '10px',
        fontWeight: 500,
        '& .MuiSvgIcon-root': {
          color: 'gray.light',
          height: '18px',
          width: '18px',
        },
      }}
    />
  </Box>
);

export const Primary = Template.bind({});
export const Secondary = Template.bind({});
export const Styled = StyledTemplate.bind({});

export default {
  title: 'Buttons/FlatButton',
  component: FlatButton,
} as ComponentMeta<typeof FlatButton>;

Secondary.args = { color: 'secondary' };
