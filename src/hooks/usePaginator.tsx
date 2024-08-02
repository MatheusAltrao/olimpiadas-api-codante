import { PaginatorPageChangeEvent } from "primereact/paginator";
import { useCallback, useState } from "react";

const usePaginator = () => {
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

  const onPageChange = useCallback((event: PaginatorPageChangeEvent) => {
    setFirst(event.first);
    setRows(event.rows);
  }, []);

  return {
    first,
    rows,
    onPageChange,
  };
};

export default usePaginator;
