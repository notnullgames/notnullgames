// Every cart the engine currently publishes, straight off its cart list.
// Nothing is built or stored here - add a cart to null0 and it shows up.

import CartCard from '@/CartCard'
import { cartList, getLanguage } from '@/null0'
import LanguagePicker from '@/LanguagePicker'
import useLanguageHash from '@/useLanguageHash'

export default function Gallery() {
  const [langId, pick] = useLanguageHash()
  const shown = langId ? cartList.filter((c) => c.lang === langId) : cartList
  const lang = langId ? getLanguage(langId) : null

  return (
    <>
      <LanguagePicker value={langId} onChange={pick} emptyLabel='all languages' label='show' />
      <p className='text-sm'>
        {shown.length} of {cartList.length} carts
        {lang ? (
          <>
            , written in {lang.title}. <a href={`/null0/languages/${lang.id}`}>More about {lang.title} carts</a>.
          </>
        ) : (
          ', in ' + new Set(cartList.map((c) => c.lang)).size + ' languages.'
        )}
      </p>
      <div className='flex gap-4 flex-wrap not-prose'>
        {shown.map((cart) => (
          <CartCard key={cart.id} {...cart} />
        ))}
      </div>
    </>
  )
}
