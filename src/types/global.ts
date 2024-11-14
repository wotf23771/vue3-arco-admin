export {};
declare global {
  interface DictOption {
    value: string | number
    label?: string,
  }

  interface PageParam {
    pageNo: number,
    pageSize: number,
  }

  interface PageResult extends PageParam {
    totalCount: number;
  }

  interface WebResult<T> {
    success: boolean,
    message?: string,
    data?: T,
    page?: PageResult
  }
}
