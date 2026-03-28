export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sort?: string; // format: field.asc,field.desc
}

export const getPagination = (params: PaginationParams) => {
  const page = params.page || 1;
  const pageSize = params.pageSize || 10;
  
  return {
    take: pageSize,
    skip: (page - 1) * pageSize,
  };
};

export const getSorting = (sortString?: string) => {
  if (!sortString) return undefined;

  const sorting: any[] = [];
  const parts = sortString.split(',');

  parts.forEach((part) => {
    const [field, order] = part.split('.');
    if (field && order) {
      sorting.push({ [field]: order.toLowerCase() });
    }
  });

  return sorting.length > 0 ? sorting : undefined;
};
