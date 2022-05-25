const toFixedTwo = (value) => {
  if (!value || Number(value).toString() === 'NaN') return ''
  return Number(value).toFixed(2)
}
export {toFixedTwo}
