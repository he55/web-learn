const p = new URLSearchParams(location.search)
export const token = {
  'x-token': p.get('t') ?? '',
}
const org = p.get('org')

const _url = (path) => {
  let base = import.meta.env.VITE_API_URL + path
  if (org === 'njfs') {
    base = base.replace('/api/dashboard', '/api/dashboard2')
  } else if (org === 'gyqzfs') {
    base = base.replace('/api/dashboard', '/api/dashboard3')
  } else if (org === 'zztffs3') {
    base = base.replace('/api/dashboard', '/api/dashboard_z3')
  } else if (org === 'zztffs4') {
    base = base.replace('/api/dashboard', '/api/dashboard_z4')
  }
  return base
}

export const getInpatientDashboard = () => {
  const res = fetch(_url('/api/dashboard/getinpatientdashboard'), {
    headers: {
      ...token,
    },
  })
  return res
}

export const getSettings = () => {
  const res = fetch(_url('/api/dashboard/getsettings'), {
    headers: {
      ...token,
    },
  })
  return res
}

export const saveSettings = (data) => {
  const res = fetch(_url('/api/dashboard/savesettings'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...token,
    },
    body: JSON.stringify(data),
  })
  return res
}
