// import DrawerInitiator from '../utils/drawer-initiator';
import UrlParser from '../routes/url-parser';
import routes from '../routes/routes';
import DrawerInitiator from '../utils/drawer-initiator';

class App {
  constructor({ button, drawer, content }) {
    this._button = button;
    this._drawer = drawer;
    this._content = content;

    this._initialAppShell();
  }

  _initialAppShell() {
    DrawerInitiator.init({
      button: this._button,
      drawer: this._drawer,
      content: this._content,
    });

    // kita bisa menginisiasikan komponen lain bila ada
  }

  _skipToContent() {
    const skipLink = document.querySelector('.skip-link');
    const mainContent = document.getElementById('mainContent');
    skipLink.addEventListener('click', (event) => {
      event.preventDefault();
      mainContent.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
      skipLink.blur();
    });
  }

  async renderPage() {
    const url = UrlParser.parseActiveUrlWithCombiner();
    const page = routes[url];
    if (page) {
      this._content.innerHTML = await page.render();
      await page.afterRender();
    } else {
      this._content.innerHTML = '<h2>Page Not Found</h2>'; // Handle 404
    }
    this._skipToContent();

  }
}

export default App;