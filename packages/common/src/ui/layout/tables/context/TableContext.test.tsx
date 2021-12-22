import React, { FC } from 'react';
import { TableStore, useIsGrouped } from './TableContext';
import { act } from 'react-dom/test-utils';
import { renderHook } from '@testing-library/react-hooks';
import { TableProvider, createTableStore } from './TableContext';
import { LocalStorage } from '../../../../localStorage';

const useStore = createTableStore();

describe('TableContext - expanding rows', () => {
  it('sets a single row as expanded once called', () => {
    const { result } = renderHook<unknown, TableStore>(useStore);

    const { setActiveRows, toggleExpanded } = result.current;

    act(() => {
      setActiveRows(['a', 'b', 'c']);
      toggleExpanded('a');
    });

    expect(result.current.rowState['a']?.isExpanded).toBe(true);
    expect(result.current.rowState['b']?.isExpanded).toBe(false);
    expect(result.current.rowState['c']?.isExpanded).toBe(false);
  });

  it('sets a single row as not expanded when called twice', () => {
    const { result } = renderHook<unknown, TableStore>(useStore);

    const { setActiveRows, toggleExpanded } = result.current;

    act(() => {
      setActiveRows(['a', 'b', 'c']);
      toggleExpanded('a');
      toggleExpanded('a');
    });

    expect(result.current.rowState['a']?.isExpanded).toBe(false);
    expect(result.current.rowState['b']?.isExpanded).toBe(false);
    expect(result.current.rowState['c']?.isExpanded).toBe(false);
  });

  it('sets all active rows as expanded when expand all is called', () => {
    const { result } = renderHook<unknown, TableStore>(useStore);

    const { setActiveRows, toggleAllExpanded } = result.current;

    act(() => {
      setActiveRows(['a', 'b', 'c']);
      toggleAllExpanded();
    });

    expect(result.current.rowState['a']?.isExpanded).toBe(true);
    expect(result.current.rowState['b']?.isExpanded).toBe(true);
    expect(result.current.rowState['c']?.isExpanded).toBe(true);
  });

  it('sets all active rows as not expanded when expand all is called twice', () => {
    const { result } = renderHook<unknown, TableStore>(useStore);

    const { setActiveRows, toggleAllExpanded } = result.current;

    act(() => {
      setActiveRows(['a', 'b', 'c']);
      toggleAllExpanded();
      toggleAllExpanded();
    });

    expect(result.current.rowState['a']?.isExpanded).toBe(false);
    expect(result.current.rowState['b']?.isExpanded).toBe(false);
    expect(result.current.rowState['c']?.isExpanded).toBe(false);
  });

  it('sets all active rows as expanded when expand all is called in an indeterminate state', () => {
    const { result } = renderHook<unknown, TableStore>(useStore);

    const { setActiveRows, toggleExpanded, toggleAllExpanded } = result.current;

    act(() => {
      setActiveRows(['a', 'b', 'c']);
      toggleAllExpanded();
      toggleExpanded('b');
      toggleAllExpanded();
    });

    expect(result.current.rowState['a']?.isExpanded).toBe(true);
    expect(result.current.rowState['b']?.isExpanded).toBe(true);
    expect(result.current.rowState['c']?.isExpanded).toBe(true);
  });

  it('only sets the expanded state when toggling, not the selected state', () => {
    const { result } = renderHook<unknown, TableStore>(useStore);

    const { setActiveRows, toggleExpanded } = result.current;

    act(() => {
      setActiveRows(['a', 'b', 'c']);
      toggleExpanded('a');
    });

    expect(result.current.rowState['a']?.isExpanded).toBe(true);
    expect(result.current.rowState['a']?.isSelected).toBe(false);
  });

  it('after setting active rows, there are no expanded rows', () => {
    const { result } = renderHook<unknown, TableStore>(useStore);

    const { setActiveRows } = result.current;

    act(() => {
      setActiveRows(['a', 'b', 'c']);
    });

    expect(result.current.numberExpanded).toBe(0);
  });
});

describe('TableContext - setting selected rows', () => {
  it('sets all rows in the row state, with a selected state of false when a set of rows is set to active', () => {
    const { result } = renderHook<unknown, TableStore>(useStore);

    const { setActiveRows } = result.current;

    act(() => {
      setActiveRows(['a', 'b', 'c']);
    });

    expect(result.current.rowState['a']?.isSelected).toBe(false);
    expect(result.current.rowState['b']?.isSelected).toBe(false);
    expect(result.current.rowState['c']?.isSelected).toBe(false);
    expect(result.current.numberSelected).toBe(0);
  });

  it('sets all rows in the row state, with a previously set selected state, if set', () => {
    const { result } = renderHook<unknown, TableStore>(useStore);

    const { toggleSelected, setActiveRows } = result.current;

    act(() => {
      setActiveRows(['a', 'b', 'c']);
      toggleSelected('a');
      setActiveRows(['a', 'b', 'c']);
    });

    expect(result.current.rowState['a']?.isSelected).toBe(true);
    expect(result.current.rowState['b']?.isSelected).toBe(false);
    expect(result.current.rowState['c']?.isSelected).toBe(false);
    expect(result.current.numberSelected).toBe(1);
  });

  it('the row state has no stale rows from previous active rows', () => {
    const { result } = renderHook<unknown, TableStore>(useStore);

    const { setActiveRows } = result.current;

    act(() => {
      setActiveRows(['a', 'b', 'c', 'd']);
      setActiveRows(['a', 'b', 'c']);
    });

    expect(result.current.rowState['a']?.isSelected).toBe(false);
    expect(result.current.rowState['b']?.isSelected).toBe(false);
    expect(result.current.rowState['c']?.isSelected).toBe(false);
    expect(result.current.rowState['d']).toBeUndefined();
    expect(result.current.numberSelected).toBe(0);
  });

  it('sets a row to selected when selected and the state of the number of selected rows is updated', () => {
    const { result } = renderHook<unknown, TableStore>(useStore);

    const { toggleSelected, setActiveRows } = result.current;

    act(() => {
      setActiveRows(['a', 'b', 'c']);
      toggleSelected('a');
      toggleSelected('b');
    });

    expect(result.current.rowState['a']?.isSelected).toBe(true);
    expect(result.current.rowState['b']?.isSelected).toBe(true);
    expect(result.current.rowState['c']?.isSelected).toBe(false);
    expect(result.current.numberSelected).toBe(2);
  });

  it('sets all rows to selected when no rows are selected and toggleAll is called', () => {
    const { result } = renderHook<unknown, TableStore>(useStore);

    const { toggleAll, setActiveRows } = result.current;

    act(() => {
      setActiveRows(['a', 'b', 'c']);
      toggleAll();
    });

    expect(result.current.rowState['a']?.isSelected).toBe(true);
    expect(result.current.rowState['b']?.isSelected).toBe(true);
    expect(result.current.rowState['c']?.isSelected).toBe(true);
    expect(result.current.numberSelected).toBe(3);
  });

  it('sets all rows to selected if there is a single unselected row and toggleAll is called', () => {
    const { result } = renderHook<unknown, TableStore>(useStore);

    const { toggleSelected, toggleAll, setActiveRows } = result.current;

    act(() => {
      setActiveRows(['a', 'b', 'c']);
      toggleAll();
      toggleSelected('a');
      toggleAll();
    });

    expect(result.current.rowState['a']?.isSelected).toBe(true);
    expect(result.current.rowState['b']?.isSelected).toBe(true);
    expect(result.current.rowState['c']?.isSelected).toBe(true);
    expect(result.current.numberSelected).toBe(3);
  });

  it('sets all rows to selected if there is a single selected row and toggleAll is called', () => {
    const { result } = renderHook<unknown, TableStore>(useStore);

    const { toggleSelected, toggleAll, setActiveRows } = result.current;

    act(() => {
      setActiveRows(['a', 'b', 'c']);
      toggleSelected('a');
      toggleAll();
    });

    expect(result.current.rowState['a']?.isSelected).toBe(true);
    expect(result.current.rowState['b']?.isSelected).toBe(true);
    expect(result.current.rowState['c']?.isSelected).toBe(true);
    expect(result.current.numberSelected).toBe(3);
  });

  it('sets all rows to unselected when all rows are selected and toggleAll is called', () => {
    const { result } = renderHook<unknown, TableStore>(useStore);

    const { toggleAll, setActiveRows } = result.current;

    act(() => {
      setActiveRows(['a', 'b', 'c']);
      toggleAll();
      toggleAll();
    });

    expect(result.current.rowState['a']?.isSelected).toBe(false);
    expect(result.current.rowState['b']?.isSelected).toBe(false);
    expect(result.current.rowState['c']?.isSelected).toBe(false);
    expect(result.current.numberSelected).toBe(0);
  });
});

describe("TableContext - grouping rows", () => {
    it('after setting active rows, the grouped state is unchanged', () => {
      const { result } = renderHook<unknown, TableStore>(useStore);

      const { setActiveRows, setIsGrouped } = result.current;

      const firstResult = result?.all?.[0];
      if (!(firstResult instanceof Error)) {
        expect(firstResult?.isGrouped).toBe(false);
      }

      act(() => {
        setIsGrouped(true);
        setActiveRows(['a', 'b', 'c']);
      });

      const secondResult = result?.all?.[1];
      if (!(secondResult instanceof Error)) {
        expect(secondResult?.isGrouped).toBe(true);
      }

      expect.assertions(2);
    });

    it('calling setIsGrouped correctly sets the grouped state', () => {
      const { result } = renderHook<unknown, TableStore>(useStore);

      const { setIsGrouped } = result.current;

      const firstResult = result?.all?.[0];
      if (!(firstResult instanceof Error)) {
        expect(firstResult?.isGrouped).toBe(false);
      }

      act(() => {
        setIsGrouped(true);
      });

      const secondResult = result?.all?.[1];
      if (!(secondResult instanceof Error)) {
        expect(secondResult?.isGrouped).toBe(true);
      }

      expect.assertions(2);
    });
})

describe('useIsGrouped', () => {
  const Wrapper: FC = ({ children }) => {
    return (
      <TableProvider createStore={createTableStore}>{children}</TableProvider>
    );
  };

  it('persists the current grouped state to local storage', () => {
    const { result } = renderHook(() => useIsGrouped('inboundShipment'), {
      wrapper: Wrapper,
    });

    expect(result.current.isGrouped).toBe(false);
    expect(LocalStorage.getItem('/groupbyitem')).toBe(null);

    act(() => {
      result.current.toggleIsGrouped();
    });

    expect(result.current.isGrouped).toBe(true);
    expect(LocalStorage.getItem('/groupbyitem')).toEqual(
      expect.objectContaining({
        inboundShipment: true,
      })
    );
  });

  it('the initial state when there does not exist any value in local storage is false', () => {
    expect(LocalStorage.getItem('/groupbyitem')).toEqual(null);

    const { result } = renderHook(() => useIsGrouped('inboundShipment'), {
      wrapper: Wrapper,
    });

    expect(result.current.isGrouped).toBe(false);
  });

  it('the local storage is set after using the hook once when none has persisted prior', () => {
    expect(LocalStorage.getItem('/groupbyitem')).toEqual(null);

    const { result } = renderHook(() => useIsGrouped('inboundShipment'), {
      wrapper: Wrapper,
    });

    act(() => {
      result.current.toggleIsGrouped();
    });

    expect(LocalStorage.getItem('/groupbyitem')).toEqual(
      expect.objectContaining({
        inboundShipment: true,
        outboundShipment: false,
      })
    );
  });

  it('the initial state is equal to the persisted value', () => {
    LocalStorage.setItem('/groupbyitem', {
      outboundShipment: false,
      inboundShipment: true,
    });
    expect(LocalStorage.getItem('/groupbyitem')).toEqual(
      expect.objectContaining({ inboundShipment: true })
    );

    const { result } = renderHook(() => useIsGrouped('inboundShipment'), {
      wrapper: Wrapper,
    });

    expect(result.current.isGrouped).toBe(true);
  });
});
