

export function samplefbd() {
    var graph = new joint.dia.Graph;
    var paper = new joint.dia.Paper({
        el: $('#myholder'), // HTML上div ID
        model: graph,
        width: 600,         // 画布宽
        height: 400,        // 画布宽
        gridSize: 5,        // 图形元素移动步进像素
        drawGrid: true,     // 显示步进点
        background: {       // 画布背景色
            color: 'rgba(0, 0, 0, 0.1)'
        },
        // 连接线风格
        defaultLink: new joint.shapes.logic.Wire({
            connector: { name: 'jumpover' },  // 当连线交叉时，跳过
        }),
        linkPinning: false,   // 不允许连线到空白处
        // 距离节点连接点25像素时自动连接上
        snapLinks: {
            radius: 25
        },
        // 验证连线是否允许
        validateConnection: function (viewSource, magnetSource, viewTarget, magnetTarget, end, viewLink) {
            if (end === 'target') {
                // 连线目标必须时一个"in"类型连接点
                if (!magnetTarget || !magnetTarget.getAttribute('port-group') || magnetTarget.getAttribute('port-group').indexOf('in') < 0) {
                    return false;
                }

                // 检查连接点是否已经有线接入
                var portUsed = this.model.getLinks().some(function (link) {
                    return (link.id !== viewLink.model.id &&
                        link.get('target').id === viewTarget.model.id &&
                        link.get('target').port === magnetTarget.getAttribute('port'));
                });

                return !portUsed;

            } else { // end === 'source'
                // 连线起始点必须时一个"out"类型连接点
                return magnetSource && magnetSource.getAttribute('port-group') && magnetSource.getAttribute('port-group').indexOf('out') >= 0;
            }
        },
    });


    // 创建基础元件模板
    var gateTemplate = new joint.shapes.devs.Model({
        position: {
            x: 0,
            y: 0
        },
        size: {
            width: 50,
            height: 60
        },
        portMarkup: '<rect class="joint-port-body" width="10" height="3" style="fill:black" />',
        portLabelMarkup: '<text class="port-label joint-port-label" font-size="10" y="0" fill="#000" /> ',
        ports: {
            groups: {
                'in': {
                    attrs: {
                        '.port-body': {
                            magnet: 'passive',
                        },
                        '.joint-port-body': {
                            x: -10
                        }
                    },
                    label: {
                        position: {
                            args: { x: 18 },
                        },
                    },
                },
                'out': {
                    label: {
                        position: {
                            args: { x: -23 },
                        },
                    },
                }
            }
        },
        attrs: {
            '.label': {
                'type': 'primary',
                fontSize: 12,
                'ref-x': .5,
                'ref-y': .05
            },
        }
    });

    function genAndPr() {
        return gateTemplate.clone().set('inPorts', ['in1', 'in2']).set('outPorts', ['out']).attr('.label/text', 'And');
    }
    function genAnd() {
        return genAndPr().set('portMarkup', '<rect class="port-body joint-port-body" width="10" height="2" style="fill:black" />').attr('.label/type', 'instance');
    }

    function genOrPr() {
        return gateTemplate.clone().set('inPorts', ['in1', 'in2']).set('outPorts', ['out']).attr('.label/text', 'Or');
    }
    function genOr() {
        return genOrPr().set('portMarkup', '<rect class="port-body joint-port-body" width="10" height="2" style="fill:black" />').attr('.label/type', 'instance');
    }

    function genNotPr() {
        return gateTemplate.clone().set('inPorts', ['in ']).set('outPorts', ['out']).attr('.label/text', 'Not');;
    }
    function genNot() {
        return genNotPr().set('portMarkup', '<rect class="port-body joint-port-body" width="10" height="2" style="fill:black" />').attr('.label/type', 'instance');
    }

    var delButton = new joint.shapes.standard.TextBlock();
    delButton.resize(10, 10);
    delButton.position(0, 0);
    delButton.attr('label/text', 'X');

    paper.on({
        // 'blank:pointerdown': function(elementView, evt) {
        //     if (this.currentEle) {
        //       console.log(this.currentEle);
        //       this.currentEle.unhighlight();
        //       this.currentEle = null;
        //     }
        // },

        'element:pointerdown': function (elementView, evt) {
            // if (this.currentEle) {
            //   console.log(this.currentEle);
            //   this.currentEle.unhighlight();
            //   this.currentEle = null;
            // }

            if (elementView.model.attr('.label/type') == 'primary') {
                var type = elementView.model.attr('.label/text');
                if (type == 'And') {
                    graph.addCell(genAndPr().translate(20, 20));
                } else if (type == 'Or') {
                    graph.addCell(genOrPr().translate(20, 120));
                } else if (type == 'Not') {
                    graph.addCell(genNotPr().translate(20, 220));
                }
                // 挪到图层的上层
                elementView.model.toFront();
            } else if (elementView.model.attr('.label/type') == 'instance') {
                evt.data = elementView.model.position();
                // elementView.highlight();
                // this.currentEle = elementView;
            }
        },

        'element:pointerup': function (elementView, evt, x, y) {
            if (elementView.model.attr('.label/type') == 'primary') {
                if (elementView.model.position().x > 105) {
                    var type = elementView.model.attr('.label/text');
                    if (type == 'And') {
                        graph.addCell(genAnd().translate(elementView.model.position().x, elementView.model.position().y));
                    } else if (type == 'Or') {
                        graph.addCell(genOr().translate(elementView.model.position().x, elementView.model.position().y));
                    } else if (type == 'Not') {
                        graph.addCell(genNot().translate(elementView.model.position().x, elementView.model.position().y));
                    }
                }
                graph.removeCells(elementView.model);
            } else {
                if (elementView.model.position().x < 110) {
                    elementView.model.position(evt.data.x, evt.data.y);
                }
            }
        },

        'element:mouseover': function (elementView, evt) {

            if (elementView.model.attr('.label/type') == 'instance') {
                console.log(elementView);
                elementView.highlight();
                elementView.model.embed(delButton.clone().translate(elementView.model.position().x, elementView.model.position().y))
            }
        },

        'element:mouseout': function (elementView, evt) {
            if (elementView.model.attr('.label/type') == 'instance') {
                elementView.unhighlight();
            }
        },

        'element:pointerdblclick': function (elementView, evt) {
            if (elementView.model.attr('.label/type') == 'instance') {
                evt.data = elementView.model.position();
                elementView.model.remove();
            }
        },

    })

    graph.addCell(genAndPr().translate(20, 20));
    graph.addCell(genOrPr().translate(20, 120));
    graph.addCell(genNotPr().translate(20, 220));

    var separator = new joint.shapes.standard.Polyline();
    separator.resize(5, 400);
    separator.position(95, 0);
    //separator.attr('body/refPoints', '115,0 115,400 120,400 120,0');
    separator.addTo(graph);

    document.getElementById("mySavedModel").value = JSON.stringify(graph.toJSON());

    // 将go模型以JSon格式保存在文本框内
    document.getElementById("saveButton").addEventListener("click", function () {
        document.getElementById("mySavedModel").value = JSON.stringify(graph.toJSON());
    });

    // 读取文本框内JSon格式的内容，并转化为gojs模型
    document.getElementById("loadButton").addEventListener("click", function () {
        graph.fromJSON(JSON.parse(document.getElementById("mySavedModel").value));
    });
}
