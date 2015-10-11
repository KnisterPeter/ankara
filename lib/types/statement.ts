import * as babylon from 'babylon';
import {Node} from './node';

export abstract class Statement<T extends babylon.Node> extends Node<T> {
}
