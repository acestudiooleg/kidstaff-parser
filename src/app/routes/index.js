/* ============
 * Routes File
 * ============
 *
 * The routes and redirects are defined in this file.
 */

// Routes
import articles from './articles';
import home from './home';

const index = {
  path: '/',
  redirect: '/home',
};

const other = {
  path: '/*',
  redirect: '/home',
};

/**
 * The routes
 *
 * @type {object} The routes
 */
export default [
  articles,
  index,
  home,
  other
];
