import { getPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Inicio',
      href: getPermalink('/'),
    },
    {
      text: 'Etiquetas',
      href: getPermalink('/tags'),
    },
    {
      text: 'Etiquetas fijadas',
      links: [
        {
          text: 'Test',
          href: getPermalink('/tag/test'),
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
  footNote: `
    Edu (@soker90)
  `,
};
