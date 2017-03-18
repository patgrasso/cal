import {ReduceStore} from 'flux/utils';
import {EventActionTypes} from './ActionTypes';
import {Map} from 'immutable';
import Dispatcher from './dispatcher';
import providers from './providers';

class EventStore extends ReduceStore {

  constructor() {
    super(Dispatcher);
  }
