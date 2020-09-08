/**
 * @fileoverview Top-level routing information for easy page management.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports App
 * 
 * @requires NPM:react
 * @requires 
 */
import React from 'react'

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import PublishIcon from '@material-ui/icons/Publish';

import CorpusDeleter from './components/corpus_manager/delete';
import CorpusEditor from './components/corpus_manager/edit';
import CorpusIngester from './components/corpus_manager/ingest';
import CorpusManager from './components/corpus_manager';
import Search from './components/search';
import Multitext from './components/multitext';
import CorpusViewer from './components/corpus_manager/CorpusViewer';


const mode = String(process.env.REACT_APP_MODE);


/**
 * Routes to corpus management pages conditioned on admin mode.
 */
const corpusRoutes = mode.toLowerCase() === 'admin' 
                     ? [{link: '/corpus', name: 'Corpus', component: CorpusManager}]
                     : [
                        {icon: <LibraryBooksIcon />, link: '/corpus', name: 'View the Corpus', component: CorpusManager},
                        {icon: <PublishIcon />, link: '/corpus/ingest', name: 'Ingest a Text', component: CorpusIngester},
                        {icon: <EditIcon />, link: '/corpus/edit', name: 'Edit Text Metadata', component: CorpusEditor},
                        {icon: <DeleteIcon />, link: '/corpus/delete', name: 'Delete a Text', component: CorpusDeleter},
                       ];


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
  ...corpusRoutes,
  {link: "/multitext", name: "Multitext", component: Multitext}
];


export default routes;
