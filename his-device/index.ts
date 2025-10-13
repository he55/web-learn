import sql from 'mssql'

process.loadEnvFile()

const conn_string = process.env.CONN_STRING

async function work() {
  const res = await fetch('http://localhost:5000/api/ct?after_id=0&limit=20')
  if (!res.ok) {
    return
  }

  const list = (await res.json()) as object[]

  const conn = await sql.connect(conn_string)

  for (const item of list) {
    const r = await conn.query`INSERT INTO [view_pacs](
    [brxm],[brxb],[brnl],[ksmc]
    ,[ksys],[mzhm],[zyhm],[brch]
,[jcfy],[jcbw],[jcxm],[jclx]
,[KDRQ],[hisnum])`
    console.log(r)
  }
}

await work()
