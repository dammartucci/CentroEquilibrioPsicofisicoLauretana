
class DataStructureUtilities{

    async loadData(filename){
		let file = await fetch(filename);    //doesn't work with local testing if CORS rules are active!
		let data = await file.json();
	    return data;
	}
	
	excludeKeys(struct,exclKeys){
		let out = structuredClone(struct);
		
		for(let i=0;i<exclKeys.length;i++)
			if(out[exclKeys[i]] !== undefined)
		        delete out[exclKeys[i]];
		
		return out;
	}
    	
	//STRUCTURES: check number of dimensions
	hasZeroDimension(struct){
		if(!struct)
		    return false;
		if(typeof(struct) != "object")
			return true;
		else 
			if(Array.isArray(struct))
			    return true;
			else
				return false;
	}
	
	hasOneDimension(struct){
	    if(!struct)
		    return false;
			
	    if(typeof(struct) == "object")
			for(let key in struct){
				if(typeof(struct[key]) == "object" && !Array.isArray(struct[key]))  //instanceof(obj)
	                return false;
			}
        else
            return false;		
			
		return true;	
	}
	
	
	translateStructureIntoStringArray(struct){
		let out = [];
		this.recursiveTranslateStructureIntoStringArray(struct,out);
		return out;		
	}
	translateStructureIntoString(struct,joiner){
		let out = [];
		this.recursiveTranslateStructureIntoStringArray(struct,out);
		return out.join(joiner);		
	}
	recursiveTranslateStructureIntoStringArray(struct,arr) {
		if(this.hasOneDimension(struct))
			for(let key in struct)
				arr.push(struct[key]);
		else
		if(this.hasZeroDimension(struct))
		    arr.push(struct);
		else
			for(let key in struct)
			    this.recursiveTranslateStructureIntoStringArray(struct[key],arr);
	}
	
}