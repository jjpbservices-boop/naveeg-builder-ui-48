import { createRouter, createRoute } from '@tanstack/react-router';
import { createBrowserHistory } from 'history';
import { routeTree } from './routeTree.gen';

const basename = import.meta.env.VITE_BASE_PATH ?? '/';
const history = createBrowserHistory({ window, basename });

const notFound = createRoute({
  getParentRoute: () => routeTree,
  path: '*',
  component: () => <div className="p-8">Page not found</div>,
});

const routeTreeWithNotFound = routeTree.addChildren([notFound]);

export const router = createRouter({ routeTree: routeTreeWithNotFound, history });


