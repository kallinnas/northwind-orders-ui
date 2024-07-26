import { MatPaginatorIntl } from '@angular/material/paginator';

export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
    const totalPages = Math.ceil(length / pageSize);
    return `Page: ${page + 1} of ${totalPages}`;
  };

  return customPaginatorIntl;
}