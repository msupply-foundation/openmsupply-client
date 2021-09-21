import React from 'react';
import { render } from '@testing-library/react';

import { TableBody, Table } from '@mui/material';

import { DataRow } from './DataRow';

describe('DataRow', () => {
  const cells = [
    {
      render: () => <span>josh</span>,
      getCellProps: () => ({ key: Math.random() * 20 }),
      column: { align: 'left' },
    },
  ] as any;

  it('Renders a cell passed', () => {
    const { getByText } = render(
      <Table>
        <TableBody>
          <DataRow cells={cells} rowData={{ id: 'josh' }} />
        </TableBody>
      </Table>
    );

    expect(getByText(/josh/)).toBeInTheDocument();
  });
});
