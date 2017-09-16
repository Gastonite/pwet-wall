import Property from "pwet/src/property";
import Attribute from "pwet/src/attribute";
import { isPlainObject, isString, isInteger, isDeeplyEqual } from "kwak";
import IDOMComponent from "pwet-idom";
import { renderDiv, renderImage, renderStyle } from 'idom-util';


const Wall = (component) => {};

Wall.properties = {
  bricks: Attribute.array(),
  brickHeight: Attribute.integer({ defaultValue: 240 })
};

Wall.logLevel = 1;

Wall.decorators = [IDOMComponent];

Wall.shadow = { mode: 'open' };

Wall.initialize = ({ element }, properties, initialize) => {

  properties.bricks = properties.bricks.reduce((bricks, brick, i) => {

    if (!isPlainObject(brick) || !isString(brick.src))
      return bricks;

    if (!isString(brick.flex) || brick.flex.length < 1)
      brick.flex = 'initial';

    bricks.push(brick);

    return bricks;
  }, []);

  initialize(!isDeeplyEqual(element.bricks, properties.bricks));
};

Wall.render = (component) => {

  const { element } = component;
  const { bricks, brickHeight } = element.properties;

  renderStyle(Wall.style);

  renderDiv(`bricks`, ['class', 'bricks'], () => {
    let brickStyle;

    bricks.forEach((brick, i) => {

      brickStyle = `--flex: ${brick.flex};`;
      brickStyle += `--height: ${brickHeight};`;

      renderDiv(`brick${i}`, ['class', 'brick'], 'style', brickStyle, () => {

        renderImage(brick.src, null, [])
      });
    });
  });
};

export default Wall;