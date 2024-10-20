import { INavLink } from "@/lib/ui/models/nav-link.model";

export const MINI_SIDEBAR_NAV_ENDPOINTS: INavLink[] = [
  {
    text: 'Home',
    url: '',
    icon: 'home',
    type: 'top',
  },
  {
    text: 'Logs',
    url: 'history',
    icon: 'history',
    type: 'bottom',
  },
  {
    text: 'Model Weights',
    url: 'likes',
    icon: 'M',
    type: 'bottom',
  },
];