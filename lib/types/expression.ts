import * as babylon from 'babylon';
import {Node} from './node';

export abstract class Expression<T extends babylon.Node> extends Node<T> {
}
