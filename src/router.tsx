// src/router.tsx
import { createRouter } from '@tanstack/react-router'
import { createBrowserHistory } from '@tanstack/history'
import { routeTree } from './routeTree.gen'

const basepath = import.meta.env.VITE_BASE_PATH ?? '/'

// TanStack history (has .subscribe)
const history = createBrowserHistory({ window, basepath })

// Ensure non-null location.state on first load
if (history.location.state == null) {
  history.replace(history.location, {})
}

export const router = createRouter({
  routeTree,
  history,
  defaultNotFoundComponent: () => (
    <div className="p-8">Page not found</div>
  ),
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}