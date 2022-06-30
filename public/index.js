import { Core } from "../src/core"

window.onload = () => {
    const crop = new Core('crop');
    crop.addDraw('area', {});
    const area = crop.getDraw('area');
    area.onListener('onmousedown', event => {
        console.log('onmousedown', event);
    }).onListener('onchange', event => {
        console.log('onchange', event);
    }).onListener('onmouseup', event => {
        console.log('onmouseup', event);
    });
    crop.setEdit('area');
    crop.create();
}
