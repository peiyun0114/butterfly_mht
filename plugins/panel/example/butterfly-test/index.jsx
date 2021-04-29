import React, {Component} from 'react';
import BaseCanvas from '../../../../src/canvas/baseCanvas.js';

// import panelPlugins from '../../dist/index.js';
import panelPlugins from '../../src/index.js';

import pika from '../img/pikatest.jpg';

// import '../../dist/index.css';
import 'butterfly-dag/dist/index.css';
import './index.less';

class Test extends Component {
  constructor() {
    super();
  }
  componentDidMount() {
    let root = document.getElementById('dag-canvas');
    this.canvas = new BaseCanvas({
      root: root,
      disLinkable: true, // 可删除连线
      linkable: true,    // 可连线
      draggable: true,   // 可拖动
      zoomable: true,    // 可放大
      moveable: true,    // 可平移
    });

    this.canvas.draw({}, () => {
    });
    this.canvas.on('events', (data) => {
      // console.log(data);
    });
    panelPlugins.register([{
      root: document.getElementById('dnd'),
      canvas: this.canvas,
      type: 'uml',
      width: 40,
      height: 40,
      data: [
        {
          id: 'user-1',
          type: 'png',
          content: pika,
          with: 40,
          height: 40,
        }
      ]
    }],()=>{console.log('finish');});
  }
  render() {
    return (
      <div className='test'>
        <div className="dnd" id='dnd'></div>
        <div className="test-canvas" id="dag-canvas">
        </div>
      </div>
    );
  }
}

export default Test;
