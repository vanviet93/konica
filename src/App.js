import * as React from "react";
import { BrowserRouter, Switch, Link, Route } from "react-router-dom";

import "./App.css";
import TestPage from "./pages/top_page/TestPage";
import TopPage from "./pages/top_page/TopPage";

const App = () => {
	return <BrowserRouter>
		<Switch>
			<Route path="/" exact render={(props)=><TopPage {...props}/>} />
			<Route path="/test" exact render={(props)=><TestPage {...props}/>} />
		</Switch>
	</BrowserRouter>
}

export default App;