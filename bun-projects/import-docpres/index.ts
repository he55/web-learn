import fs from 'node:fs'
import readline from 'node:readline'
import mssql, { type IResult } from 'mssql'

declare module 'bun' {
  interface Env {
    MSSQL: string
  }
}

type User = {
  UserID: number
  Name: string
  DeptID: number
  DeptName: string
}

type PatientInfo = {
  AdmisID: number
  HospitalNo: string
  PatientName: string
  PatientID: number
}

type Project = {
  patientName: string
  hospitalNo: string
  drugName: string
  spec: string
  quantity: number
  makeDate: string
  verifyDate: string
  usageText: string
  usageQuantity: string
  usageDay: string
  clinicalUnit: string
  verifyOperatorName: string
  doctorName: string
  price: number
  salesUnit: string
  amount: number
}

function parse(str: string): [string, string] {
  if (!str) {
    return ['null', '']
  }
  let i = 0
  for (; i < str.length; i++) {
    const s = str[i]
    if (
      s === '0' ||
      s === '1' ||
      s === '2' ||
      s === '3' ||
      s === '4' ||
      s === '5' ||
      s === '6' ||
      s === '7' ||
      s === '8' ||
      s === '9'
    ) {
      continue
    } else {
      break
    }
  }

  const str1 = str.substring(0, i)
  const str2 = str.substring(i)

  return [str1, str2]
}

const stream = readline.createInterface({
  input: fs.createReadStream('data.csv'),
})

let isHeader = true
let headers = ''
const data: Project[] = []
for await (const line of stream) {
  if (isHeader) {
    headers = line
    isHeader = false
    continue
  }

  const strs = line.replaceAll('：', ':').split(',')

  const d = parse(strs[8]!)

  data.push({
    patientName: strs[0]!,
    hospitalNo: strs[1]!,
    drugName: strs[2]!,
    spec: strs[3]!,
    quantity: Number(strs[4]),
    makeDate: strs[5]!,
    verifyDate: strs[6]!,
    usageText: strs[7]!,
    usageQuantity: d[0],
    usageDay: strs[9]!,
    clinicalUnit: d[1],
    verifyOperatorName: strs[10]!,
    doctorName: strs[11]!,
    price: Number(strs[12]!),
    salesUnit: strs[13]!,
    amount: 0,
  })
}

await mssql.connect(process.env.MSSQL)

const e = new Set([...data.map((x) => x.doctorName), ...data.map((x) => x.verifyOperatorName)])
const f = [...e].map((x) => `'${x}'`).join(',')

const users: IResult<User> = await mssql.query(`select a.UserID, a.Name, c.DeptID, c.Name DeptName
from SYS_Users a
         left join [SYS_Employee] b on a.EMPID = b.EMPID
         left join [SYS_Department] c on b.DeptID = c.DeptID
where a.Name in (${f})`)

const g = new Set([...data.map((x) => x.hospitalNo)])
const h = [...g].map((x) => `'${x}'`).join(',')

const patients: IResult<PatientInfo> =
  await mssql.query(`select AdmisID, HospitalNo, PatientName, PatientID
from ZY_AdmissionInfo
where HospitalNo in (${h})`)

let sqlStr = ''
for (const item of data) {
  const patient = patients.recordset.find((x) => x.HospitalNo === item.hospitalNo)!
  const doctor = users.recordset.find((x) => x.Name === item.doctorName)!
  const nurse = users.recordset.find((x) => x.Name === item.verifyOperatorName)!

  item.amount = item.quantity * item.price
  sqlStr += `INSERT INTO ZY_DoctorPres (AdmisID, PatientID, PatientName, Attribute, State, PresType, ProjectId,
                                      ProjectName, Place, Specifications, SalesUnit, ClinicalUnit, Price, Quantity,
                                      Payment, Frequency, UsageQuantity, UsageDay, UsageText, SkinTest,
                                      SkinTestDescription, GiveQuantity, GiveDescription, ChangeNum, Discount,
                                      YHDescription, TotalAmount, PayAmount, ExecDeptId, ExecDeptName, CostLevel1No,
                                      CostLevel1Name, CostLevel2No, CostLevel2Name, DeptId, DeptName, DoctorId,
                                      DoctorName, GroupType, GroupNo, Remark, MakeDate, RecordDate, ExamineDate,
                                      ExamineDeptId, ExamineDeptName, ExamineDoctorId, ExamineDoctorName, ExecDate,
                                      VerifyDate, VerifyOperatorId, VerifyOperatorName, StopDate, StopDoctorId,
                                      StopDoctorName, DiscardDate, DiscardOperatorId, DiscardOperatorName,
                                      DiscardStatus, DiscardReviewerDate, DiscardReviewerId, DiscardReviewerName,
                                      CreateDate, StopConfirmState, IsFirstDay, Body, BodyName, IsPoison, DripRate,
                                      Method, MinUnit, MinQuantity, IsSurgical, IsDeleted, Remark2,
                                      DonationEffectiveDays, GiveItemruleId, YZBH, AssociationNo, IsMainProject,
                                      DeletedBy, DeletedByName, DeletedAt, OperatorType, IsAutomatic, GePatientNumber,
                                      Doctor2Id, Doctor2Name, PackageId)
VALUES (${patient.AdmisID}, ${patient.PatientID}, '${item.patientName}', 1, 10, 0, 1117, '${item.drugName}', '', '${item.spec}', '${item.salesUnit}',
        '${item.clinicalUnit}', ${item.price}, ${item.quantity}, null, N'stat', ${item.usageQuantity}, ${item.usageDay}, '${item.usageText}', 0, null, 0.00, null, 1, 100.00, null, ${item.amount},
        ${item.amount}, 2, N'西药房', -2, N'西药费', -1002, N'西药费', ${doctor.DeptID}, '${doctor.DeptName}', ${doctor.UserID}, '${item.doctorName}', 0, null, N'备注',
        '${item.makeDate}', '${item.makeDate}', null, null, null, null, null, N'',
        '${item.verifyDate}', ${nurse.UserID}, '${item.verifyOperatorName}', null, null, null, null, null, null, null, null,
        null, null, '${item.makeDate}', 0, 0, null, null, 0, null, null, '${item.salesUnit}', ${item.quantity}, 0, 0, N'补', 0, -1, null,
        null, 0, null, null, null, 0, 0, null, null, null, 0);\n
`
}

await Bun.write('import.sql', sqlStr)
process.exit()
