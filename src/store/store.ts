import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { Store } from '../types/store';
import { createAuthSlice } from './auth-slice';

export const useStore = create<Store>()(
    devtools(
        persist(
            subscribeWithSelector(
                immer((...a) => ({
                    ...createAuthSlice(...a),
                }))
            ),
            {
                name: 'local-storage',
            }
        )
    )
);
