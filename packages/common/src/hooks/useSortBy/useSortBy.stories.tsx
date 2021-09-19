import React from 'react';
import { useSortBy } from './useSortBy';
import { Story } from '@storybook/react';

export default {
  title: 'Hooks/useSortBy',
};

interface TestSortBy {
  id: string;
  quantity: number;
}

const getColumn = (id: string): any => ({
  id,
  defaultSortDirection: 'asc',
});

const Template: Story = () => {
  const { sortBy, onChangeSortBy } = useSortBy<TestSortBy>(getColumn('id'));

  return (
    <div>
      <div>
        <span> Two buttons to sort by two different keys, ID or Quantity.</span>
        <button onClick={() => onChangeSortBy(getColumn('id'))}>
          Sort by ID!
        </button>
        <button onClick={() => onChangeSortBy(getColumn('quantity'))}>
          Sort by Quantity!
        </button>
      </div>

      <p style={{ whiteSpace: 'pre-line' }}>
        {JSON.stringify(sortBy, null, 2)}
      </p>
    </div>
  );
};

export const Primary = Template.bind({});
