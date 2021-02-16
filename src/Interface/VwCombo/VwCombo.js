export default class VwCombo {
    constructor(subObjectId) {
        importClass("VImage");
        this.combo = theRoot.dataView().control(subObjectId);
    }

    setList(list) {
        list = [
            {name: "", data: ""},
            ...list
        ]
        this.combo.clear();
        list.forEach((item) => {
            if(!item.hasOwnProperty("name")) {
                throw new Error("SetList item has no property name");
            }

            if(!item.hasOwnProperty("data")) {
                throw new Error("SetList item has no property data");
            }

            var image = null;

            if(item.hasOwnProperty("imageIdRef")) {
                image = new VImage();
                image.loadResource(item.imageIdRef);
                this.combo.addItem(image, item.name, item.data);
            } else {
                this.combo.addItem(item.name, item.data);
            }
        });
    }

    get currentData() {
        return this.combo.itemData(this.combo.currentIndex);
    }

    selectElement(index) {
        this.combo.setCurrentIndex(index);
    }

    selectElementByValue(value) {
        const index = this.combo.findData(value);
        this.combo.setCurrentIndex(index);
    }

    clear() {
        this.combo.clear();
    }
}