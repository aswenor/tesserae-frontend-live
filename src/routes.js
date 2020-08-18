/**
 * @fileoverview Top-level routing information for easy page management.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports App
 * 
 * @requires NPM:react
 * @requires NPM:react-router-dom
 * @requires ./components/common/NavBar/index.js:NavBar
 * @requires ./components/search/index.js:Search
 */
import Search from './components/search';
import Library from './components/library';
import CorpusManager from './components/corpus_manager';
import Multitext from './components/multitext';


/**
 * Routing data for various pages in the app.
 */
const routes = [
  /**
   * Metadata for a page.
   * 
   * @field {string} link The URL path to the page.
   * @field {string} name The name of the page being linked.
   * @field {React.Component} component The component to render.
   */
  {link: "/", name: "Search", component: Search},
  {link: "/corpus", name: "Corpus", component: CorpusManager},
  {link: "/multitext", name: "Multitext", component: Multitext}
  // {link: "/corpora", name: "Corpora", component: Library}
];


export default routes;
