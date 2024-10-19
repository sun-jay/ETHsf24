import Layout from '@/components/layout/layout';
import '@/styles/globals.scss'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux';
import store from "../store/index";
import DarkThemeProvider from '@/providers/dark-theme-provider/dark-theme-provider';
import MiniPlayerWrapper from '@/components/mini-player-wrapper/mini-player-wrapper';
import { StyledEngineProvider } from '@mui/material/styles';
import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";

import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

export default function App({ Component, pageProps }: AppProps) {

  return (
    <DynamicContextProvider
      settings={{
        // Find your environment id at https://app.dynamic.xyz/dashboard/developer
        environmentId: "a0039c28-2d29-4666-98d7-e318b235ed33",
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
    <Provider store={store}>
      <StyledEngineProvider injectFirst>
        <DarkThemeProvider>
          <Layout>
            <Component {...pageProps} />
            <MiniPlayerWrapper />
          </Layout>
        </DarkThemeProvider>
      </StyledEngineProvider>
    </Provider>
    </DynamicContextProvider>

  );
}
