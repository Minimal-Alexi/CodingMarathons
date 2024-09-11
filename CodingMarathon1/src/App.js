import './App.css';


import BookCollectionManager from './components/Book/BookCollectionManager'
import ContactListManager from './components/Contact/ContactListManage'
import RecipeManager from './components/Recipes/RecipeManager'
import RecipeShoppingCartManager from './components/Vikkos/ShoppingCart'

function App() {
  return (
    <div className="App">
      <BookCollectionManager />
      <ContactListManager />
      <RecipeManager />
      <RecipeShoppingCartManager />
    </div>
  );
}

export default App;