import moment from 'moment'

const tooltipFormatter = (params) => {
  params.sort((a, b) => a.seriesIndex - b.seriesIndex)
  const data = params[0].data || {}
  // 涨跌幅
  const date = data.date || '2088-08-08 08:08'
  let html = '<div>' + moment(date).format('YYYY-MM-DD HH:mm') + '</div>'
  // 价格
  const marker1 = '<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:gold;"></span>'
  const currentPrice = data.price || '-'
  const priceText = `<div style="text-align: left">${marker1}价格：${currentPrice}</div>`
  // 涨跌幅
  const percent = data.percent || '-'
  let color
  if (percent > 0) {
    color = '#ee4957'
  } else if (percent < 0) {
    color = '#01d078'
  } else {
    color = 'gray'
  }
  const marker2 = `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${color};"></span>`
  const percentText = `<div style="text-align: left">${marker2}涨幅：${percent}%</div>`
  // 均价
  const marker3 = '<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#ff9e12;"></span>'
  const average = data.averagePrice || '-'
  const averagePriceText = `<div style="text-align: left">${marker3}均价：${average}</div>`
  // 成交量
  const marker4 = '<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#0091fc;"></span>'
  let minuVolume = data.minuVolume || '-'
  if (minuVolume !== '-') {
    if (minuVolume >= 100000000) {
      minuVolume = (minuVolume / 100000000).toFixed(2) + '亿'
    }
  }
  const volumeText = `<div style="text-align: left">${marker4}成交量：${minuVolume}手</div>`
  return html + priceText + percentText + averagePriceText + volumeText
}
export {tooltipFormatter}
