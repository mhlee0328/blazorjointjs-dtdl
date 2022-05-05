


export function HelloWorld(name) {
    var graph = new joint.dia.Graph;    // 创建画板，所有图上的元素都在画板里
    var paper = new joint.dia.Paper({   // 创建画板上的画布，画布是用来渲染画板
        el: document.getElementById('myGraph'),  // 指向HTML里ID为"myGraph"的元素
        model: graph,    // 指定画板
        width: 600,      // 画布宽600像素
        height: 100,     // 画布高100像素
        gridSize: 1,     // 画布上元素拖动时步进的像素，默认1，设的高方便对齐
        background: {    // 画布背景色
            color: 'rgba(0, 0, 0, 0.1)'
        },
    });

    // 创建一个矩形
    var rect = new joint.shapes.standard.Rectangle();
    rect.position(100, 30);    // 矩形左上角的位置，x:100,y:30，单位像素
    rect.resize(100, 40);      // 矩形大小，宽100，高40，单位像素
    rect.attr({
        body: {
            fill: 'blue'       // 填充色
        },
        label: {
            text: 'Hello',     // 矩形上显示的文字
            fill: 'white'      // 文字颜色
        }
    });

    rect.addTo(graph);          // 将上面定义的矩形加入到画板中
    var rect2 = rect.clone();   // 复制一个相同的矩形
    rect2.translate(300, 0);    // 将矩形在水平方向上向右移动300像素
    rect2.attr('label/text', `World!  ${name}`);  // 设置矩形2上的文字
    rect2.addTo(graph);         // 将矩形2加入到画板中

    // 创建一条连线
    var link = new joint.shapes.standard.Link();
    link.source(rect);   // 连线头为矩形1
    link.target(rect2);  // 连线尾为矩形2
    link.addTo(graph);   // 将上面定义的连线加入到画板中
}


