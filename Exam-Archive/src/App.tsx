import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const HomePage = lazy(() => import('./pages/homePage'));
const SignInPage = lazy(() => import('./pages/signinPage'));
const LoginPage = lazy(()=> import('./pages/loginPage'))
const NotFound = lazy(()=> import('./pages/notfound'))

function App() {

return(
  <div className='App'>
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/signIn' element={<SignInPage/>}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='*' element={<NotFound/>}/>
        </Routes>
      </Suspense>
    </BrowserRouter>
  </div>

)
}

export default App
