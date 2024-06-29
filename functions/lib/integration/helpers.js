const parseMandaeStatus = (id, name) => {
  switch (`${id}`) {
    case '1':
      return 'delivered'
    case '101':
    case '110':
    case '31':
    case '33':
    case '118':
    case '160':
    case '122':
    case '123':
    case '124':
    case '119':
    case '120':
    case '0':
    case '121':
      return 'shipped'
  }
  if (name === 'Encomenda coletada') {
    return 'shipped'
  }
  return null
}

module.exports = {
  parseMandaeStatus
}
