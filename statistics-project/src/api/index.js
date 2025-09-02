const p = new URLSearchParams(location.search)
export const token = {
  'x-token': p.get('t') ?? '',
}

const url = (path) => {
  let a = import.meta.env.VITE_API_URL + path
  if (p.get('org') === 'njfs') {
    a = a.replace('/api/dashboard', '/api/dashboard2')
  }
  return a
}

export const getInpatientDashboard = () => {
  const res = fetch(url('/api/dashboard/getinpatientdashboard'), {
    headers: {
      ...token,
    },
  })
  return res
}

export const getSettings = () => {
  const res = fetch(url('/api/dashboard/getsettings'), {
    headers: {
      ...token,
    },
  })
  return res
}

export const saveSettings = (data) => {
  const res = fetch(url('/api/dashboard/savesettings'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...token,
    },
    body: JSON.stringify(data),
  })
  return res
}
