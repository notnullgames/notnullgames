// Every cart the engine currently publishes, straight off its cart list.
// Nothing is built or stored here - add a cart to null0 and it shows up.

import { useState } from 'react'
import CartCard from '@/CartCard'
import { cartList, languages } from '@/null0'
import LanguagePicker from '@/LanguagePicker'

export default function Gallery() {
  const [langId, langIdSet] = useState('')
  const shown = langId ? cartList.filter((c) => c.lang === langId) : cartList

  return (
    <>
      <LanguagePicker value={langId} onChange={langIdSet} emptyLabel='all languages' label='show' />
      <p className='text-sm'>
        {shown.length} of {cartList.length} carts
        {langId ? '' : ', in ' + new Set(cartList.map((c) => c.lang)).size + ' languages'}.
      </p>
      <div className='flex gap-4 flex-wrap not-prose'>
        {shown.map((cart) => (
          <CartCard key={cart.id} {...cart} />
        ))}
      </div>
    </>
  )
}
