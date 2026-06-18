import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';

export function readingTimeRemarkPlugin() {
  return function (tree, file) {
    const textOnPage = toString(tree);
    const readingTime = Math.ceil(getReadingTime(textOnPage).minutes);

    // Astro 5: el frontmatter se escribe en file.data directamente
    if (!file.data.astro) file.data.astro = { frontmatter: {} };
    file.data.astro.frontmatter.readingTime = readingTime;
  };
}
