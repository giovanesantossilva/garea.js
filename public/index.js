import { Core as Manager } from "../src/core"

window.onload = () => {
    const crop = new Manager('crop');
    crop.addDraw('area');
    crop.addDraw('line', {
        stroke: 3,
        type: 'line'
    });
    const area = crop.getDraw('area');
    const line = crop.getDraw('line');
    // line.setPoints([
    //     { x: 30, y: 30 },
    //     { x: 200, y: 200 }
    // ]);
    line.setColor('points', 'rgb(255, 0, 0)');
    line.setColor('stroke', 'rgb(255, 0, 0)');
    line.onListener('onmousedown', event => {
        console.log('onmousedown', event);
    }).onListener('onchange', event => {
        console.log('onchange', event);
    }).onListener('onmouseup', event => {
        console.log('onmouseup', event);
    });
    area.setDisable(true);
    crop.setEdit('area');
    // crop.removeDraw('area1');
    // crop.create();
}
