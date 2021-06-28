const { expect } = require("@jest/globals")

export function expectRelations(expected, actual){
    expected.forEach(a => expectRelations_(a, actual))
}

function expectRelations_(expected, actual){
    const items = expected.split(".");
    let data_ = actual;

    for(const i in items){
        data_ = data_[items[i]];
        
        if(data_ instanceof Array && data_.length > 0) {
            data_ = data_[0];
        } 
    
        expect(data_).toBeDefined();
    }
}
