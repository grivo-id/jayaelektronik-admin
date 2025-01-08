import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';

// Perfect Scrollbar
import 'react-perfect-scrollbar/dist/css/styles.css';

// Tailwind css
import './tailwind.css';

// i18n (needs to be bundled)
import './i18n';

// Router
import { RouterProvider } from 'react-router-dom';
import router from './router/index';

// React Query
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

// Redux
import { Provider } from 'react-redux';
import store from './store/index';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Suspense>
            <QueryClientProvider client={queryClient}>
                <Provider store={store}>
                    <RouterProvider router={router} />
                    {import.meta.env.DEV && <ReactQueryDevtools />}
                </Provider>
            </QueryClientProvider>
        </Suspense>
    </React.StrictMode>
);
