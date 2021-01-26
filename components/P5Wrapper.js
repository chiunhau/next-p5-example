import React, { useEffect } from 'react';
import p5 from 'p5';
import sketch from './sketch';

const P5Wrapper = props => {
  useEffect(() => {
    let myp5 = new p5(sketch);
  }, [])

  return (
    <div id={props.id} style={{lineHeight: 0}}>
    </div>
  )
}

export default P5Wrapper;