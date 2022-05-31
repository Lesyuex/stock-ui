const toFixedTwo = (value, percent = false) => {
  if (!value || Number(value).toString() === 'NaN') return ''
  return percent ? Number(value).toFixed(2) + '%' : Number(value).toFixed(2)
}
const fomatValue = (value) => {
  if (!value || Number(value).toString() === 'NaN') return ''
  const num = Number(value)
  if (num > 100000000) return (num / 100000000).toFixed(2) + '亿'
  if (num > 1000000) return (num / 10000000).toFixed(2) + '千万'
  if (num > 10000) return (num / 10000).toFixed(2) + '万'
}
export {toFixedTwo, fomatValue}
