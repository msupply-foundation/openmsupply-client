/* eslint-disable @typescript-eslint/no-explicit-any */

import { useSortBy } from './useSortBy';
import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';

interface TestSortBy {
  id: string;
  quantity: number;
}

const column = { id: 'id', defaultSortDirection: 'asc' } as any;

describe('useSortBy', () => {
  it('Has the correct initial value', () => {
    const { result } = renderHook(() => useSortBy<TestSortBy>(column));

    expect(result.current.sortBy).toEqual({
      key: 'id',
      isDesc: false,
      direction: 'asc',
    });
  });

  it('has the correct values after triggering a sort by', () => {
    const { result } = renderHook(() => useSortBy<TestSortBy>(column));

    act(() => {
      result.current.onChangeSortBy({ ...column, id: 'quantity' });
    });

    expect(result.current.sortBy).toEqual({
      key: 'quantity',
      isDesc: false,
      direction: 'asc',
    });
  });

  it('has the correct values after triggering a sort by for the same column that is set', () => {
    const { result } = renderHook(() =>
      useSortBy<TestSortBy>({ ...column, id: 'quantity' })
    );

    act(() => {
      result.current.onChangeSortBy({ ...column, id: 'quantity' });
    });

    expect(result.current.sortBy).toEqual({
      key: 'quantity',
      isDesc: true,
      direction: 'desc',
    });
  });

  it('has the correct values after triggering a few sort bys in sequence', () => {
    const { result } = renderHook(() => useSortBy<TestSortBy>(column));

    act(() => {
      // initially: id/asc
      result.current.onChangeSortBy(column);
      // should be: id/desc
      result.current.onChangeSortBy(column);
      // should be: quantity/asc
      result.current.onChangeSortBy({ ...column, id: 'quantity' });
      // should be: id/asc
      result.current.onChangeSortBy(column);
      // should be: quantity/asc
      result.current.onChangeSortBy({ ...column, id: 'quantity' });
      // should be: quantity/desc
      result.current.onChangeSortBy({ ...column, id: 'quantity' });
    });

    expect(result.current.sortBy).toEqual({
      key: 'quantity',
      isDesc: true,
      direction: 'desc',
    });
  });
});
