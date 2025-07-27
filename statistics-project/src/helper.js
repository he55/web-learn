const p = new URLSearchParams(location.search)
export const token = {
  'x-token': p.get('t') ?? '',
}
