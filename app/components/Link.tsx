// app/components/Link.tsx
import { useCallback } from 'react';
import {
  Link as RouterLink,
  NavLink as RouterNavLink,
  LinkProps as RouterLinkProps,
  NavLinkProps as RouterNavLinkProps,
  
} from 'react-router';

import {usePrefixPathWithLocale} from '~/lib/i18n';


// Custom Link component
export function Link(props: RouterLinkProps) {
  const {to, ...rest} = props;
  const toWithLocale =  usePrefixPathWithLocale(to.toString());
  return <RouterLink to={toWithLocale} {...rest} />;
}

// Custom NavLink component
export function NavLink(props: RouterNavLinkProps) {
  const {to, ...rest} = props;
  const toWithLocale = usePrefixPathWithLocale(to.toString());

  console.log('NavLink toWithLocale:', toWithLocale);
  return <RouterNavLink to={toWithLocale} {...rest} />;
}
