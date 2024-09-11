import './BookCollectionManager.css';
import './App.css';

import BookCollectionManager from './BookCollectionManager';
// import ContactListManager from ''
// import RecipeManager from ''
// import RecipeShoppingCartManager from ''
import './App.css';


// import BookCollectionManager from ''
// import ContactListManager from ''
import RecipeManager from './components/Recipes/RecipeManager';
//import RecipeShoppingCartManager from ''

function App() {
  return (
    <div className="App">
      <BookCollectionManager />
      {/* <ContactListManager />
      <RecipeManager />
      <RecipeShoppingCartManager /> */}
{/*       <BookCollectionManager />
      <ContactListManager />*/}
      <RecipeManager /> 
      {/* <RecipeShoppingCartManager />  */}
    </div>
  );
}

export default App;
