const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    pid: Number,
    vertical: String,
    type: String
});

productSchema.methods.addProducts = function () {
    verticals = ['Bedsheets', 'Curtains', 'Shirts', 'Sarees', 'Kaftans'];
    verticalType = [['King Size (108X108in)', 'King Size (90X100in)', 'Queen Size (81X96in)', 'Kids/Twin (60X90in)'],
                 ['Curtain (Window-5ft)', 'Curtain (Window-7ft)', 'Curtain (Door-8ft)', 'Curtain (Door-9ft)'],
                 ['38', '40', '42', '44'],
                 ['6.5m'],
                 ['XS', 'S', 'M', 'L', 'XL']];
    id = 1;

    for (i=0; i<verticals.length; i++){
        for (j=0; j<verticalType[i].length; j++){
            const prod = new product({
                pid: id,
                vertical: verticals[i],
                type: verticalType[i][j]
            })
            prod.save();
            id++ ;
        }
    }
    
  }

const product = mongoose.model('Products', productSchema);

module.exports = product;