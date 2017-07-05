const abi = require("./ABI.js");
const utils = require('ethereumjs-util')

class Measurement {

	constructor(_attribute_id, _value, _event_id, _timestamp, _farmer_id, _batch_id, _device) {
		this.attribute_id = _attribute_id;
		this.value = _value;
		this.event_id = _event_id;
		this.timestamp = _timestamp;
		this.farmer_id = _farmer_id;
		this.batch_id = _batch_id;
		this.device = _device;
	}

	hash() {        
		const TYPES = [ "bytes32", "int", "bytes32", "uint", "bytes32", "bytes32", "address" ];
        let values = [ this.attribute_id, this.value, this.event_id, this.timestamp, this.farmer_id, this.batch_id, this.device];
        return abi.soliditySHA3(TYPES, values).toString('hex');
	}

	encode() {
		const TYPES = [ "bytes32", "int", "bytes32", "uint", "bytes32", "bytes32", "address", "bytes32" ];		
        let values = [ this.attribute_id, this.value, this.event_id, this.timestamp, this.farmer_id, this.batch_id, this.device, '0x' + this.hash()];        
        return TYPES.map( (type, i) => this.normalizeLength(values[i], type));
	}

	normalizeLength(value, type, i){
      	if (type=="address"){
       		return "0x" + utils.setLengthLeft(value, 32).toString('hex');
       	} else {
       		return "0x" + abi.solidityPack([type], [value]).toString('hex');
		}
	}

	static encodeMultiple(measurements) {
		return measurements.map(m => m.encode()).reduce((a, b) => a.concat(b), []);
	}
}

module.exports = Measurement