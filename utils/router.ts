
export type PrefetchOptions = {
    priority?: boolean
    locale?: string | false
  }

export function addBasePath(path: string): string {
    // we only add the basepath on relative urls
    return addPathPrefix(path, basePath)
  }

  
export function addLocale(
    path: string,
    locale?: string | false,
    defaultLocale?: string
  ) {
    if (process.env.__NEXT_I18N_SUPPORT) {
      const pathname = pathNoQueryHash(path)
      const pathLower = pathname.toLowerCase()
      const localeLower = locale && locale.toLowerCase()
  
      return locale &&
        locale !== defaultLocale &&
        !pathLower.startsWith('/' + localeLower + '/') &&
        pathLower !== '/' + localeLower
        ? addPathPrefix(path, '/' + locale)
        : path
    }
    return path
  }
  

/**
 * Resolves a given hyperlink with a certain router state (basePath not included).
 * Preserves absolute urls.
 */
 export function resolveHref(
    router: NextRouter,
    href: Url,
    resolveAs?: boolean
  ): string {
    // we use a dummy base url for relative urls
    let base: URL
    let urlAsString = typeof href === 'string' ? href : formatWithValidation(href)
  
    // repeated slashes and backslashes in the URL are considered
    // invalid and will never match a Next.js page/file
    const urlProtoMatch = urlAsString.match(/^[a-zA-Z]{1,}:\/\//)
    const urlAsStringNoProto = urlProtoMatch
      ? urlAsString.substr(urlProtoMatch[0].length)
      : urlAsString
  
    const urlParts = urlAsStringNoProto.split('?')
  
    if ((urlParts[0] || '').match(/(\/\/|\\)/)) {
      console.error(
        `Invalid href passed to next/router: ${urlAsString}, repeated forward-slashes (//) or backslashes \\ are not valid in the href`
      )
      const normalizedUrl = normalizeRepeatedSlashes(urlAsStringNoProto)
      urlAsString = (urlProtoMatch ? urlProtoMatch[0] : '') + normalizedUrl
    }
  
    // Return because it cannot be routed by the Next.js router
    if (!isLocalURL(urlAsString)) {
      return (resolveAs ? [urlAsString] : urlAsString) as string
    }
  
    try {
      base = new URL(
        urlAsString.startsWith('#') ? router.asPath : router.pathname,
        'http://n'
      )
    } catch (_) {
      // fallback to / for invalid asPath values e.g. //
      base = new URL('/', 'http://n')
    }
    try {
      const finalUrl = new URL(urlAsString, base)
      finalUrl.pathname = normalizePathTrailingSlash(finalUrl.pathname)
      let interpolatedAs = ''
  
      if (
        isDynamicRoute(finalUrl.pathname) &&
        finalUrl.searchParams &&
        resolveAs
      ) {
        const query = searchParamsToUrlQuery(finalUrl.searchParams)
  
        const { result, params } = interpolateAs(
          finalUrl.pathname,
          finalUrl.pathname,
          query
        )
  
        if (result) {
          interpolatedAs = formatWithValidation({
            pathname: result,
            hash: finalUrl.hash,
            query: omitParmsFromQuery(query, params),
          })
        }
      }
  
      // if the origin didn't change, it means we received a relative href
      const resolvedHref =
        finalUrl.origin === base.origin
          ? finalUrl.href.slice(finalUrl.origin.length)
          : finalUrl.href
  
      return (
        resolveAs ? [resolvedHref, interpolatedAs || resolvedHref] : resolvedHref
      ) as string
    } catch (_) {
      return (resolveAs ? [urlAsString] : urlAsString) as string
    }
  }

  export function getDomainLocale(
    path: string,
    locale?: string | false,
    locales?: string[],
    domainLocales?: DomainLocale[]
  ) {
    if (process.env.__NEXT_I18N_SUPPORT) {
      locale = locale || normalizeLocalePath(path, locales).detectedLocale
  
      const detectedDomain = detectDomainLocale(domainLocales, undefined, locale)
  
      if (detectedDomain) {
        return `http${detectedDomain.http ? '' : 's'}://${detectedDomain.domain}${
          basePath || ''
        }${locale === detectedDomain.defaultLocale ? '' : `/${locale}`}${path}`
      }
      return false
    } else {
      return false
    }
  }
  

/**
 * Detects whether a given url is routable by the Next.js router (browser only).
 */
 export function isLocalURL(url: string): boolean {
    // prevent a hydration mismatch on href for url with anchor refs
    if (url.startsWith('/') || url.startsWith('#') || url.startsWith('?'))
      return true
    try {
      // absolute urls can be local if they are on the same origin
      const locationOrigin = getLocationOrigin()
      const resolved = new URL(url, locationOrigin)
      return resolved.origin === locationOrigin && hasBasePath(resolved.pathname)
    } catch (_) {
      return false
    }
  }