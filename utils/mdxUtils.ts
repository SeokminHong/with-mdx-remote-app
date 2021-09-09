import path from 'path';
import glob from 'glob';

import {Locale, isLocale} from './locale';

// POSTS_PATH is useful when you want to get the path to a specific file
export const POSTS_PATH = path.join(process.cwd(), 'posts');

// postFilePaths is the list of all mdx files inside the POSTS_PATH directory
export const postFilePaths = glob
  .sync(`${POSTS_PATH}/**/*.md?(x)`)
  .reduce((acc, p) => {
    let [, title, locale] = [
      ...path
        .relative(POSTS_PATH, p)
        .replace(/\\/g, '/')
        .matchAll(/(.*)\/(\w+)\.mdx?/g),
    ][0];
    if (!isLocale(locale)) {
      return acc;
    }
    if (typeof acc[title] === 'undefined') {
      acc[title] = [locale];
    } else {
      acc[title].push(locale);
    }
    return acc;
  }, {} as {[title: string]: Locale[]});
