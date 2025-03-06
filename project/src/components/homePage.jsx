import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Equipments from './equipments';
import Borrows from './borrows';


export default function HomePage() {
    return (
     
        <Router>
          <div>  
             {/* <Equipments/> */}
            <h1>מערכת השאלת ציוד</h1>
            <nav>
              <ul>
                <li>
                  <Link to="/Equipments">ציוד</Link>
                </li>
                 {/* <li>
                   <Link to="/users">משתמשים</Link>
                </li>  */}
                <li>
                  <Link to="/Borrows">השאלות</Link>
                </li>
              </ul>
            </nav>
            <Routes>
              <Route path="/equipments" element={<Equipments />} />
              {/* <Route path="/users" element={<User />} /> */}
              <Route path="/borrows" element={<Borrows />} />
            </Routes>
          </div>
        </Router>
      );
}