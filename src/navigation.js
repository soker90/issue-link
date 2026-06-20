import { getPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Directorio',
      href: getPermalink('/'),
    },
    {
      text: 'Etiquetas',
      href: getPermalink('/tags'),
    },
    {
      text: 'Historico',
      href: getPermalink('/historico'),
    },
    {
      text: 'Explorar',
      links: [
        {
          text: 'Frontend',
          href: getPermalink('/tag/frontend'),
        },
        {
          text: 'DevOps',
          href: getPermalink('/tag/devops'),
        },
        {
          text: 'Automatizacion',
          href: getPermalink('/tag/automatizacion'),
        },
        {
          text: 'Performance',
          href: getPermalink('/tag/performance'),
        },
      ],
    },
  ],
};

export const footerData = {
  socialLinks: [
    { ariaLabel: 'X', icon: 'tabler:brand-x', href: 'https://x.com/_eduparra' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/soker90/issue-link' },
  ],
};
