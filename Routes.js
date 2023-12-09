import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Dashboard } from './pages/Dashboard';
import { Listing } from './pages/Listing';
import { Profile } from './pages/Profile';
import { SignUp } from './pages/SignUp';
import { NotFound } from './pages/NotFound';

export const Routes = () => {
    return (
        <Router>
            <nav>
                <ul>
                    <li>
                        <Link to="/studentstash/dashboard">Dashboard</Link>
                    </li>
                    <li>
                        <Link to="/studentstash/listing">Listing</Link>
                    </li>
                    <li>
                        <Link to="/profile">Profile</Link>
                    </li>
                    <li>
                        <Link to="/signup">SignUp</Link>
                    </li>
                </ul>
            </nav>
            <Switch>
                <Route path="/studentstash/dashboard">
                    <Dashboard />
                </Route>
                <Route path="/studentstash/listing">
                    <Listing />
                </Route>
                <Route path="/profile">
                    <Profile />
                </Route>
                <Route path="/signup">
                    <SignUp />
                </Route>
                <Route>
                    <NotFound />
                </Route>
            </Switch>
        </Router>
    )
}