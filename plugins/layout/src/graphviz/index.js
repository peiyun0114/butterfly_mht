'use strict';

import {graphviz} from 'd3-graphviz';
import Edge from './edge';

const graphvizLayout = (params) => {
  const refactDataToString = (data) => {
    const nodes = {};
    const result = [];
    data.nodes.forEach(n => {
      nodes[n.id] = n.label;
      result.push(`${n.label} [width=${n.width ? n.width * 0.010416 * 2.5 : 2.5}, height=${n.height ? n.height * 0.010416 : 1}]`)
    })
    data.edges.forEach(e => {
      if (e.sourceNode) {
        result.push(`${nodes[e.sourceNode]} -> ${nodes[e.targetNode]};`)
      } else {
        result.push(`${nodes[e.source]} -> ${nodes[e.target]};`)
      }
    })
    return result;
  }
  
  const str = refactDataToString(params.data);
  const theGraphviz = graphviz(`body`);
  theGraphviz
    .options({
      fit: false,
      zoom: false,
    })
    .dot(`digraph {
      ${str.join('\n')}
    }`)
  
  const computedData = theGraphviz.data().children[1].children;
  
  computedData.forEach(d => {
    if (d.attributes.class === 'node') {
      const parseNode = params.data.nodes.find(n => n.label === d.key);
      parseNode.top = parseFloat(d.children.find((c) => c.tag === 'ellipse').center.y);
      parseNode.left = parseFloat(d.children.find((c) => c.tag === 'ellipse').center.x);
      if (!parseNode.width) {
        parseNode.width = parseFloat(d.children.find((c) => c.tag === 'ellipse').attributes.rx)
      }
      if (!parseNode.height) {
        parseNode.height = parseFloat(d.children.find((c) => c.tag === 'ellipse').attributes.ry) * 2;
      }
    }
    if (d.attributes.class === 'edge') {
      const parseEdge = params.data.edges.find(e => {
        const sourceId = params.data.nodes.find(n => n.label === d.key.split('->')[0]).id;
        const targetId = params.data.nodes.find(n => n.label === d.key.split('->')[1]).id
        if ((e.sourceNode === sourceId && e.targetNode === targetId) ||
          (e.source === sourceId && e.target === targetId)) {
          return true;
        }
      });
      parseEdge.shapeType = 'Bezier';
      parseEdge.d = d.children.find((c) => c.tag === 'path').attributes.d;
      if (!parseEdge.Class) {
        parseEdge.Class = Edge;
      } else {
        console.log('边无法正确绘制!');
        // const originEdge = parseEdge.Class;
        // class NewEdge extends originEdge {
        //   constructor(opts) {
        //     super(opts);
        //     this.d = opts.options.d;
        //     this.shapeType = 'Bezier';
        //   }
        //   calcPath(sourcePoint, targetPoint) {
        //     return redrawPath(d.children.find((c) => c.tag === 'path').attributes.d, sourcePoint, targetPoint);
        //   }
        // }
        // parseEdge.Class = NewEdge;
      }
    }
  })
  return params;
}


export default graphvizLayout;