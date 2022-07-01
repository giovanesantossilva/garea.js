import { Core as Manager } from "../src/core"

window.onload = () => {
    const crop = new Manager('crop');
    crop.addDraw('area');
    crop.addDraw('area1', {
        stroke: 3
    });
    const area = crop.getDraw('area');
    const area1 = crop.getDraw('area1');
    area1.setPoints([
        { x: 30, y: 30 },
        { x: 200, y: 200 }
    ]);
    area1.setColor('points', 'rgb(255, 0, 0)');
    area1.setColor('stroke', 'rgb(255, 0, 0)');
    area.onListener('onmousedown', event => {
        console.log('onmousedown', event);
    }).onListener('onchange', event => {
        console.log('onchange', event);
    }).onListener('onmouseup', event => {
        console.log('onmouseup', event);
    });
    crop.setEdit('area1');
    crop.create();
}
