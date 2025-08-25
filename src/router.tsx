import { createRouter, createRoute, createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import Layout from '@/components/Layout'

import Home from '@/pages/Home'
import Features from '@/pages/Features'
import Pricing from '@/pages/Pricing'
import Gallery from '@/pages/Gallery'
import FAQ from '@/pages/FAQ'
import Contact from '@/pages/Contact'
import Legal from '@/pages/Legal'
import Describe from '@/pages/Describe'
import Brief from '@/pages/Brief'
import Design from '@/pages/Design'
import Generate from '@/pages/Generate'
import Generating from '@/pages/Generating'
import Ready from '@/pages/Ready'
import Preview from '@/pages/Preview'
import Dashboard from '@/pages/Dashboard'
import Workspace from '@/pages/Workspace'
import Settings from '@/pages/Settings'
import Auth from '@/pages/Auth'
import NotFound from '@/pages/NotFound'

import AnalyticsDashboard from '@/features/analytics/AnalyticsDashboard'
import DomainDashboard from '@/features/domains/DomainDashboard'
import SecurityDashboard from '@/features/security/SecurityDashboard'
import BillingDashboard from '@/features/billing/BillingDashboard'
import PagesPanel from '@/features/builder/PagesPanel'

const DashboardIndex = () => <div>Choose a site</div>
const DashboardOverview = () => <div>Overview</div>

/** Router context (extend later if you need) */
type RouterContext = {}

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
})

/* Public */
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: Home })
const featuresRoute = createRoute({ getParentRoute: () => rootRoute, path: '/features', component: Features })
const pricingRoute = createRoute({ getParentRoute: () => rootRoute, path: '/pricing', component: Pricing })
const galleryRoute = createRoute({ getParentRoute: () => rootRoute, path: '/gallery', component: Gallery })
const faqRoute = createRoute({ getParentRoute: () => rootRoute, path: '/faq', component: FAQ })
const contactRoute = createRoute({ getParentRoute: () => rootRoute, path: '/contact', component: Contact })
const legalRoute = createRoute({ getParentRoute: () => rootRoute, path: '/legal', component: Legal })

/* Onboarding */
const onboardingBriefRoute   = createRoute({ getParentRoute: () => rootRoute, path: '/onboarding/brief',  component: Brief })
const onboardingDesignRoute  = createRoute({ getParentRoute: () => rootRoute, path: '/onboarding/design', component: Design })
const generateRoute          = createRoute({ getParentRoute: () => rootRoute, path: '/generate',          component: Generate })
const generatingRoute        = createRoute({ getParentRoute: () => rootRoute, path: '/generating',        component: Generating })
const readyRoute             = createRoute({ getParentRoute: () => rootRoute, path: '/ready',             component: Ready })

/* Legacy */
const describeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/describe', component: Describe })
const briefRoute    = createRoute({ getParentRoute: () => rootRoute, path: '/brief',    component: Brief })
const designRoute   = createRoute({ getParentRoute: () => rootRoute, path: '/design',   component: Design })
const previewRoute  = createRoute({ getParentRoute: () => rootRoute, path: '/preview',  component: Preview })

/* Auth/Settings */
const settingsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/settings', component: Settings })
const authRoute     = createRoute({ getParentRoute: () => rootRoute, path: '/auth',     component: Auth })

/* Dashboard */
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: Dashboard,
})

const dashboardIndexRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/',
  component: DashboardIndex,
})

/* /dashboard/$siteId/* */
const dashboardSiteRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '$siteId',
  component: () => <Outlet />,
})

/* Sections */
const dashboardOverviewRoute  = createRoute({ getParentRoute: () => dashboardSiteRoute, path: 'overview',  component: DashboardOverview })
const dashboardAnalyticsRoute = createRoute({ getParentRoute: () => dashboardSiteRoute, path: 'analytics', component: AnalyticsDashboard })
const dashboardDomainsRoute   = createRoute({ getParentRoute: () => dashboardSiteRoute, path: 'domains',   component: DomainDashboard })
const dashboardSecurityRoute  = createRoute({ getParentRoute: () => dashboardSiteRoute, path: 'security',  component: SecurityDashboard })
const dashboardBillingRoute   = createRoute({ getParentRoute: () => dashboardSiteRoute, path: 'billing',   component: BillingDashboard })
const dashboardPagesRoute     = createRoute({ getParentRoute: () => dashboardSiteRoute, path: 'pages',     component: PagesPanel })

/* Workspace & 404 */
const workspaceRoute = createRoute({ getParentRoute: () => rootRoute, path: '/workspace', component: Workspace })
const notFoundRoute  = createRoute({ getParentRoute: () => rootRoute, path: '/$', component: NotFound })

const routeTree = rootRoute.addChildren([
  indexRoute,
  featuresRoute,
  pricingRoute,
  galleryRoute,
  faqRoute,
  contactRoute,
  legalRoute,
  onboardingBriefRoute,
  onboardingDesignRoute,
  describeRoute,
  briefRoute,
  designRoute,
  generateRoute,
  generatingRoute,
  readyRoute,
  previewRoute,
  settingsRoute,
  authRoute,
  dashboardRoute.addChildren([
    dashboardIndexRoute,
    dashboardSiteRoute.addChildren([
      dashboardOverviewRoute,
      dashboardAnalyticsRoute,
      dashboardDomainsRoute,
      dashboardSecurityRoute,
      dashboardBillingRoute,
      dashboardPagesRoute,
    ]),
  ]),
  workspaceRoute,
  notFoundRoute,
])

export const router = createRouter({
  routeTree,
  context: {} as RouterContext,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}