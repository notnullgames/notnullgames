// this is info about all the carts (merged from YAML file in cart-dir)

import { parse } from 'yaml'

export default Object.entries(import.meta.glob('../carts/*.yml', { eager: true, query: '?raw' })).map(([filename, m]) => ({ ...parse(m.default), id: filename.replace(/^\.\.\/carts\/(.+)\.yml/, '$1') }))
