async function uploadFileWithFetch(pathname: string) {
  const bunfile = Bun.file(pathname)

  const formData = new FormData()
  formData.append('file', bunfile, '123')
  // formData.append('md5', 'hello')

  const res = await fetch('http://localhost:8080/file/upload?md5=1w23', {
    method: 'POST',
    body: formData,
    verbose: true,
  })

  if (!res.ok) {
    throw new Error('upload file is fail')
  }
}

async function main() {
  await uploadFileWithFetch('/Users/hwz/Downloads/index.ts')
}

main()
