export default class VwCombo {
    constructor(subObjectId) {
        this.combo = theRoot.dataView().control(subObjectId);
    }

    setList(list) {
        this.combo.clear();
        list.forEach((item) => {
            if(!item.hasOwnProperty("name")) {
                throw new Error("SetList item has no property name");
            }

            if(!item.hasOwnProperty("value")) {
                throw new Error("SetList item has no property value");
            }

            var image = null;

            if(item.hasOwnProperty("imageIdRef")) {
                image = new VImage();
                image.loadResource(item.imageIdRef);
            }

            if(image instanceof VImage) {
                this.combo.addItem(image, item.name, item.data);
            } else {
                this.combo.addItem(item.name, item.data);
            }
        });
    }
}