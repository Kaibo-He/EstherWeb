import {useRoutes} from 'react-router-dom';

import routes from './routes';

const App = function() {
  const element = useRoutes(routes);

  return (
    <div className="App">
      {element}
    </div>
  );
}

export default App;