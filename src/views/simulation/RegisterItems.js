/*
 * 模型注册
 * 注册了bus模型
 * 注册了工具模型基类
 * 注册了四种工具模型
 * 注册了直线
 */

import busLogo from '../assets/busLogo.png';
import adams from '../assets/adams.png';
import c from '../assets/c.png';
import matlab from '../assets/matlab.png';
import simulink from '../assets/simulink.png';

const Flow = G6Editor.Flow;

// 公交车
Flow.registerNode('bus', {
    draw(item) {
        const group = item.getGraphicGroup();
        const width = 800;
        const height = 50;
        const x = -width / 2;
        const y = -height / 2;
        const borderRadius = 20;
        const keyShape = group.addShape('rect', {
            attrs: {
                x,
                y,
                width,
                height,
                radius: borderRadius,
                lineWidth: 2,
                fill: 'white',
                stroke: '#CED4D9'
            }
        });
        // 左侧色条
        group.addShape('path', {
            attrs: {
                path: [
                    ['M', x, y + borderRadius],
                    ['L', x, y + height - borderRadius],
                    ['A', borderRadius, borderRadius, 0, 0, 0, x + borderRadius, y + height],
                    ['L', x + borderRadius, y],
                    ['A', borderRadius, borderRadius, 0, 0, 0, x, y + borderRadius]
                ],
                fill: '#FAAD14'
            }
        });
        // 名称文本
        group.addShape('text', {
            attrs: {
                text: 'Co-Simulation Bus',
                x: x + width * 0.35,
                y: y + height * 0.3,
                textAlign: 'start',
                textBaseline: 'top',
                fill: 'rgba(0,0,0,0.65)',
                fontFamily: 'Hiragino Sans GB',
                fontSize: 25
            }
        });
        // 一个logo
        group.addShape('image', {
            attrs: {
                img: busLogo,
                x: x + width - 40,
                y: y + height * 0.2,
                width: 30,
                height: 30
            }
        });
        return keyShape;
    },
    // 设置锚点
    anchor: [
        [0.1, 0, {
            type: 'input'
        }],
        [0.3, 0, {
            type: 'input'
        }],
        [0.5, 0, {
            type: 'input'
        }],
        [0.7, 0, {
            type: 'input'
        }],
        [0.9, 0, {
            type: 'input'
            // }],
            // [0.1, 1, {
            //     type: 'input'
            // }],
            // [0.3, 1, {
            //     type: 'input'
            // }],
            // [0.5, 1, {
            //     type: 'input'
            // }],
            // [0.7, 1, {
            //     type: 'input'
            // }],
            // [0.9, 1, {
            //     type: 'input'
        }]
    ]
});

// 模型基类
Flow.registerNode('model-card', {
    draw(item) {
        const group = item.getGraphicGroup();
        const model = item.getModel();
        const width = 80;
        const height = 80;
        const x = -width / 2;
        const y = -height / 2;
        const borderRadius = 20;
        const keyShape = group.addShape('rect', {
            attrs: {
                x,
                y,
                width,
                height,
                lineWidth: 2,
                radius: borderRadius,
                fill: 'white',
                stroke: '#CED4D9'
            }
        });
        // 名称文本
        if (model.label) {
            group.addShape('text', {
                attrs: {
                    text: model.label,
                    x: 0,
                    y: y - 20,
                    textAlign: 'center',
                    textBaseline: 'top',
                    fill: 'black',
                    fontSize: 15,
                    fontFamily: 'SimHei'
                }
            });
        }
        // 模型图片
        group.addShape('image', {
            attrs: {
                img: this.type_icon_url,
                x: x + 10,
                y: y + 10,
                width: 60,
                height: 60
            }
        });
        return keyShape;
    },
    // 设置锚点
    anchor: [
        [0.5, 1, {
            type: 'output'
        }]
    ]
});

Flow.registerNode('adams', {
    type_icon_url: adams
}, 'model-card');

Flow.registerNode('matlab', {
    type_icon_url: matlab
}, 'model-card');

Flow.registerNode('c', {
    type_icon_url: c
}, 'model-card');

Flow.registerNode('simulink', {
    type_icon_url: simulink
}, 'model-card');

const MIN_ARROW_SIZE = 3;
Flow.registerEdge('line', {
    draw(item) {
        const group = item.getGraphicGroup();
        const path = this.getPath(item);

        let direct = group.addShape('path', {
            attrs: {
                path,
                stroke: 'black',
                lineWidth: 3,
                startArrow: true,
                endArrow: true,
                // 虚线类型
                // lineDash: [20, 10]
            }
        });
        return direct;
    },
    getPath(item) {
        const points = item.getPoints();

        // 一个闪电特效
        // let point1 = points[0];
        // let point2 = points[1];
        // const lightningWidth = 20;
        // let newPoints = [point1, {
        //     x: (point1.x + point2.x) / 2,
        //     y: ((point1.y + point2.y) / 2 + lightningWidth)
        // }, {
        //     x: (point1.x + point2.x) / 2 + lightningWidth,
        //     y: ((point1.y + point2.y) / 2 - lightningWidth)
        // }, point2];
        // return G6Editor.Util.pointsToPolygon(newPoints);

        // 一个比较丑的空心线条特效
        // let point1 = points[0];
        // let point2 = points[1];
        // let strokeWidth = 10;
        // let arrowWidth = 30;
        // let arrowHeigh = 30;
        // let newPoints = [{
        //     x: point1.x,
        //     y: point1.y - strokeWidth / 2
        // }, {
        //     x: point2.x - arrowWidth,
        //     y: point2.y - strokeWidth / 2
        // }, {
        //     x: point2.x - arrowWidth,
        //     y: point2.y - arrowHeigh / 2
        // }, {
        //     x: point2.x,
        //     y: point2.y
        // }, {
        //     x: point2.x - arrowWidth,
        //     y: point2.y + arrowHeigh / 2
        // }, {
        //     x: point2.x - arrowWidth,
        //     y: point2.y + strokeWidth / 2
        // }, {
        //     x: point1.x,
        //     y: point1.y + strokeWidth / 2
        // },
        // {
        //     x: point1.x,
        //     y: point1.y - strokeWidth / 2
        // }];
        // return G6Editor.Util.pointsToPolygon(newPoints);

        return G6Editor.Util.pointsToPolygon(points);
    },
    afterDraw: function afterDraw(item) {
        var keyShape = item.getKeyShape();
        keyShape.attr('lineDashOffset', 0);
        keyShape.animate({
            lineDashOffset: -20,
            repeat: true
        }, 500);
    }

    // 未看出明显效果
    // ,
    // endArrow: {
    //     path(item) {
    //         const keyShape = item.getKeyShape();
    //         let lineWidth = keyShape.attr('lineWidth');
    //         lineWidth = lineWidth > MIN_ARROW_SIZE ? lineWidth : MIN_ARROW_SIZE;
    //         const width = lineWidth * 10 / 3;
    //         const halfHeight = lineWidth * 4 / 3;
    //         return [
    //             ['M', -width, halfHeight],
    //             ['L', 0, 0],
    //             ['L', -width, -halfHeight],
    //             ['L', -width, halfHeight],
    //             ['Z']
    //         ];
    //     },
    //     shorten(item) {
    //         const keyShape = item.getKeyShape();
    //         const lineWidth = keyShape.attr('lineWidth');
    //         return (lineWidth > MIN_ARROW_SIZE ? lineWidth : MIN_ARROW_SIZE) * 3.1;
    //     },
    //     style(item) {
    //         const keyShape = item.getKeyShape();
    //         const { strokeOpacity, stroke } = keyShape.attr();
    //         return {
    //             fillOpacity: strokeOpacity,
    //             fill: stroke
    //         };
    //     }
    // }
    // 未看出明显效果
    // ,
    // endArrow: {
    //     path(item) {
    //         const keyShape = item.getKeyShape();
    //         let lineWidth = keyShape.attr('lineWidth');
    //         lineWidth = lineWidth > MIN_ARROW_SIZE ? lineWidth : MIN_ARROW_SIZE;
    //         const width = lineWidth * 10 / 3;
    //         const halfHeight = lineWidth * 4 / 3;
    //         const radius = lineWidth * 4;
    //         return [
    //             [ 'M', -width, halfHeight ],
    //             [ 'L', 0, 0 ],
    //             [ 'L', -width, -halfHeight ],
    //             [ 'A', radius, radius, 0, 0, 1, -width, halfHeight ],
    //             [ 'Z' ]
    //         ];
    //     },
    //     shorten(item) {
    //         const keyShape = item.getKeyShape();
    //         const lineWidth = keyShape.attr('lineWidth');
    //         return (lineWidth > MIN_ARROW_SIZE ? lineWidth : MIN_ARROW_SIZE) * 3.1;
    //     },
    //     style(item) {
    //         const keyShape = item.getKeyShape();
    //         const { strokeOpacity, stroke } = keyShape.attr();
    //         return {
    //             fillOpacity: strokeOpacity,
    //             fill: stroke
    //         };
    //     }
    // }
});
