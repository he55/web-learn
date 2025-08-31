const p = new URLSearchParams(location.search)
const str = p.get('patientId')

let patientId = 0
if (str) {
  patientId = parseInt(str)
}

export { patientId }
