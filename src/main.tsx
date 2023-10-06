import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import App from './App.tsx';
import { QueryClient, QueryClientProvider } from 'react-query';
import './index.css';
import AddPaslon from './components/AddPaslon.tsx';
import UpdatePaslon from './components/UpdatePaslon.tsx';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />}/>
          <Route path='/add-paslon' element={<AddPaslon />}/>
          <Route path='/update-paslon/:id' element={<UpdatePaslon />}/>
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  </QueryClientProvider>
);
