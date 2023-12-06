import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import { signup } from './pages/signup';
import { createlisting } from './pages/createlisting';
import { dashboard } from './pages/dashboard';
import { profile } from './pages/profile';

export const Routes = () => {
    return(
        <Router>
            <Switch>
                <Route path = "/">
                    <NotesPage />
                </Route>
                <Route path = "">

                </Route>
                <Route path = >

                </Route>
                <Route>

                </Route>
            </Switch>
        </Router>
    )
}