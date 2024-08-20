import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Example from './PopUp/routes/example'
import PopUpApp from './PopUp/PopUpApp'
import {
  HashRouter as Router,
  Route,
  Routes,
} from 'react-router-dom'
import './index.css'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="" element={<PopUpApp />} />
        <Route path="example" element={<Example />} />
      </Routes>
    </Router>
  </StrictMode>

)
