import Link from 'next/link'
import {UrlObject} from 'url'

type Url = UrlObject | string;
interface ICustomLinkProps {
  as: Url,
  href: Url,
  [others: string]: any
}

export default function CustomLink({ as, href, ...otherProps }: ICustomLinkProps) {
  return (
    <>
      <Link as={as} href={href}>
        <a {...otherProps} />
      </Link>
      <style jsx>{`
        a {
          color: tomato;
        }
      `}</style>
    </>
  )
}
