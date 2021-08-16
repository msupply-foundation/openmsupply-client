import React, { FC, useEffect } from 'react';
import {
  Box,
  ReduxProvider,
  AppThemeProvider,
  Typography,
  QueryClient,
  ReactQueryDevtools,
  QueryClientProvider,
  IntlProvider,
  useFormatDate,
  useHostContext,
  useTranslation,
} from '@openmsupply-client/common';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppDrawer from './AppDrawer';
import AppBar from './AppBar';
import Viewport from './Viewport';
import { LocaleKey } from '@openmsupply-client/common/src/intl/intlHelpers';

const queryClient = new QueryClient();

const CustomerContainer = React.lazy(
  () => import('customers/CustomerContainer')
);
const DashboardService = React.lazy(() => import('dashboard/DashboardService'));

const Heading: FC<{ locale: string }> = props => {
  const t = useTranslation();
  const formatDate = useFormatDate();
  const { setTitleKey } = useHostContext();
  const date = new Date();

  useEffect(
    () => setTitleKey(`app.${props.children}` as LocaleKey),
    [props.children]
  );

  return (
    <div style={{ margin: '100px 50px' }}>
      <span>
        <Typography>Current locale: {props.locale}</Typography>
        <Typography>
          {t('app.welcome', { name: '<your name here>' })}
        </Typography>
        <Typography>
          Today is{' '}
          {formatDate(date, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
          })}
        </Typography>
      </span>
      <Typography>[ {props.children} ]</Typography>
    </div>
  );
};

const Host: FC = () => {
  const { locale } = useHostContext();
  return (
    <ReduxProvider>
      <QueryClientProvider client={queryClient}>
        <IntlProvider locale={locale}>
          <AppThemeProvider>
            <BrowserRouter>
              <Viewport>
                <Box display="flex" flex={1}>
                  <AppBar />
                  <AppDrawer />
                  <React.Suspense fallback={'Loading'}>
                    <Routes>
                      <Route
                        path="dashboard/*"
                        element={<DashboardService />}
                      />
                      <Route
                        path="customers/*"
                        element={<CustomerContainer />}
                      />
                      <Route
                        path="suppliers/*"
                        element={<Heading locale={locale}>suppliers</Heading>}
                      />
                      <Route
                        path="stock/*"
                        element={<Heading locale={locale}>stock</Heading>}
                      />
                      <Route
                        path="tools/*"
                        element={<Heading locale={locale}>tools</Heading>}
                      />
                      <Route
                        path="reports/*"
                        element={<Heading locale={locale}>reports</Heading>}
                      />
                      <Route
                        path="messages/*"
                        element={<Heading locale={locale}>messages</Heading>}
                      />
                      <Route
                        path="*"
                        element={<Navigate to="/dashboard" replace />}
                      />
                    </Routes>
                  </React.Suspense>
                </Box>
              </Viewport>
            </BrowserRouter>
          </AppThemeProvider>
          <ReactQueryDevtools initialIsOpen />
        </IntlProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
};

export default Host;
