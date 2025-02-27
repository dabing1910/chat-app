import { ChakraProvider } from '@chakra-ui/react';
import Layout from './components/Layout';
import { SharedStateProvider } from './context/SharedStateContext';

function App() {
  return (
    <ChakraProvider>
      <SharedStateProvider>
        <Layout />
      </SharedStateProvider>
    </ChakraProvider>
  );
}

export default App
