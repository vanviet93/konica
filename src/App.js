import * as React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import "./App.css";
import ComponentPage from "./pages/component_page/ComponentPage";
import ModelPage from "./pages/model_page/ModelPage";
import TopPage from "./pages/top_page/TopPage";
import EffectPage from "./pages/effect_page/EffectPage";
const App = () => {
	return <BrowserRouter>
		<Switch>
			<Route path="/" exact render={(props)=><TopPage {...props}/>} />
			<Route path="/comp" exact render={(props)=><ComponentPage {...props}/>} />
			<Route path="/model" exact render={(props)=><ModelPage {...props}/>} />
			<Route path="/effect" exact render={(props)=><EffectPage {...props}/>} />
		</Switch>
	</BrowserRouter>
}

export default App;