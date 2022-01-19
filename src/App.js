import * as React from "react";
import { BrowserRouter, Switch, Link, Route } from "react-router-dom";

import "./App.css";
import ComponentPage from "./pages/component_page/ComponentPage";
import ModelPage from "./pages/model_page/ModelPage";
import TopPage from "./pages/top_page/TopPage";

const App = () => {
	return <BrowserRouter>
		<Switch>
			<Route path="/" exact render={(props)=><TopPage {...props}/>} />
			<Route path="/comp" exact render={(props)=><ComponentPage {...props}/>} />
			<Route path="/model" exact render={(props)=><ModelPage {...props}/>} />
		</Switch>
	</BrowserRouter>
}

export default App;