import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const HomePage = lazy(() => import('./pages/homePage'));
const SignInPage = lazy(() => import('./pages/signinPage'));
const LoginPage = lazy(()=> import('./pages/loginPage'))
const NotFound = lazy(()=> import('./pages/notfound'))
const Upload=lazy(()=>import('./pages/uploadPage'))
const Search=lazy(()=>import('./pages/searchPage'))
const Account=lazy(()=>import('./pages/accountPage'))
const EmailRecovery=lazy(()=>import('./pages/emailRecovery'))


function App() {

return(
  <div className='App'>
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/signIn' element={<SignInPage/>}/>
          <Route path='/search' element={<Search/>}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/upload' element={<Upload/>}/>
          <Route path='/account' element={<Account/>}/>
          <Route path='/emailRecovery' element={<EmailRecovery/>}/>
          <Route path='*' element={<NotFound/>}/>
        </Routes>
      </Suspense>
    </BrowserRouter>
  </div>

)
}

export default App
