interface Params {
  method: string;
  body?: string;
}

export const loginPost = async (address: string) => {
  const r = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({address})
  });

  return r.json();
}
export const logoutGet = async () => {
  const r = await fetch('/api/logout', {method: 'GET'});

  return r.json();
}

export const getCommodityList = async (id?: string | null) => {
  let queryString = '';
  if (id) queryString = new URLSearchParams({id}).toString()
  const r = await fetch('/api/commodity' + (queryString ? `?${queryString}` : ''), {method: 'GET'});

  return r.json();
}
