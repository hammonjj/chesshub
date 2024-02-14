import './App.css'
import SettingsProvider from './contexts/SettingsProvider'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import ValidateAccount from './pages/ValidateAccount'
import ChangePassword from './pages/ChangePassword'
import Layout from './pages/Layout'
import AppContent from './AppContent'

function App() {
  return (
    <SettingsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<AppContent />} />
            <Route path="change-password" element={<ChangePassword />}/>
            <Route path="validate-account" element={<ValidateAccount />} />
          </Route>
        </Routes>
      </Router>
    </SettingsProvider>
  )
}

export default App
