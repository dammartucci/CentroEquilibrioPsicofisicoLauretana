//SO FAR, DATABASES ARE ONLY BE MANAGED BY A SERVER. so static websites shouldn't be able
//to do so. Is this true? In this class, I implemented a hierarchical database with javascript!
//in this way, the server is decentralized to the destination machine. 

/*I call this "Server Decentralization" or "Server Emulation".
Advantages:
    -no additional costs for a dedicated PHP server, allowing a better QOS for small businesses;
	-database scalability: entries can be added indefinitely;
	-self-generated query search bar, depending on json data structure, and inner query search engine to manage queries;
Neutral (depends on POVs):
    -the source code and the entire database is shared with every client;
Disadvantages:
    -loading performance depends on database size, client machine processing power and internet bandwidth;
	-searching performance depends on database size, and client machine processing power;
	-can't use for sensitive data, since they can be manually accessed by inspecting the json archive.
Conclusions:
Some disadvantages are not negotiable. The class has a limited usage scope.
*/

/*THE INPUT IS A JSON FILE, conventionally called archive_lang.json, that must have a precise data structure.
the reason why this particular structure exists is to provide at the same time both the data
and the corresponding filters to be applied on them. 
to accomplish this, labels, measurement units, acceptable data ranges, are required, 
and occupy respectively the first three entries the json array.

STEPS TO DEFINE YOUR DATA STRUCTURE. string values only are used:
  1.create a monodimensional key-value pairs list for a sample item to model, covering all possible cases.
    then begin the abstraction: 
  2.if needed, group the leaves semantically in sub data structures. now copy and paste three times.
  3A.for each leaf, define the corresponding name, including the name of the sub-structure as "$name" key. 
     if the sub-array must not be considered as filter, prepend the sub-array key with $.
  3B.then write the associated measurement units, empty string if not present.
  3C.finally the acceptable range. the info about ranges is contained in the actuator class, SpinnerModel.js
now, the fourth item is the first item of the dataset to represent.
*/

/*STRUCTURE OF THIS CLASS       AND       ACTIONS TO PERFORM ON THE INLINE SCRIPT CONTAINED IN THE WEBPAGE YOU WISH TO USE THIS CLASS ON:

async loadArchive(filename) MODEL                  X   PROVIDE FILENAME PATH
applyFiltersResolvingType(kv) MODEL
#applyANDFiltersOnData(ktv) MODEL
filterValues(data,key,filter) MODEL

#recursiveTranslateMetaStructureIntoHTML(struct0,struct1,struct2,out,abskey) VIEW(TEMPLATE)
translateMetaStructureIntoHTML() VIEW(TEMPLATE)

translateDataChunkIntoNodes() VIEW(RENDERING) MODEL
#translateDataChunkIntoNodes2() VIEW(RENDERING) MODEL
repaint(id) VIEW(RENDERING) MODEL
displayElements(id) VIEW(RENDERING) MODEL
initializeSearchBarAndFeed(id,id2) VIEW(RENDERING)            X   PROVIDE ID OF SEARCH BAR and DATA FEED <div>
setDisplayElementsDynamically(bool,id2) VIEW(RENDERING)

getCurrentSearchBarKeyValues(id) VIEW(EDITING)
resetSearchBar(id) VIEW(EDITING)      
*/

const ERROR_MESSAGE = "ERROR! Something went wrong during the generation of the node";
const META = 3;
const INCR = 12;

const WILDCARD = "*", EXCLUDEKEY = "$";

class DecentralizedServer{

    constructor(dbViewer){
		this.dbv = dbViewer;
		this.nodesHashMap = new Map();	
	}	
	
	//MODEL
   
	async loadArchive(filename){
		let file = await fetch(filename);    //doesn't work with local testing if CORS rules are active!
		let data = await file.json();
        
		this.metadata     = data.slice(0,META);
		this.originalData = data.slice(META); 
		this.filteredData = this.originalData;
		this.index = 0;
		
		this.dbv.initialize(this.metadata);
	}
	
	
	//VIEW(RENDERING)  MODEL
	
    translateDataChunkIntoNodes(){
		if(this.index > this.filteredData.length - 1)
			if(this.index == 0){
				if(this.filteredData.length == 0){
					if(document.getElementById("no-search-results") === null){
						let node = document.createElement("div");
						node.id = "no-search-results";
						node.innerHTML = `<div><b><i>${this.metadata[0].$menu.empty}</i></b></div>`;
						return [node];	
					}	
					else return [];		
				}
                else return this.#translateDataChunkIntoNodes2();				
			}
			else return [];
		else return this.#translateDataChunkIntoNodes2();
	}	
	#translateDataChunkIntoNodes2(){	
		let eol    = false;
		let start  = this.index;
		let end    = start + INCR;
		
		if(end > this.filteredData.length - 1){
			end = this.filteredData.length;
			eol = true;
		}
		this.index = end;
		
		let nodes = [];
		for(let i=start;i<end;i++){
			if(this.filteredData[i].$aux.available != this.metadata[2].$aux.available[0])
				continue;
		
			let key = this.filteredData[i].$aux.key;
			let val = this.nodesHashMap.get(key);       //cache the Nodes into a hashmap to optimize 
														//data rendering in case of applying filters
			if(val === undefined){
				val = document.createElement("div");
				val.innerHTML = this.dbv.translateDbEntryIntoHTML(this.filteredData[i]);
				this.dbv.postProcessNode(val);
				this.nodesHashMap.set(key,val);
			}
			nodes.push(val);
		}
		
		if(eol){
			let node = document.createElement("div");
			node.innerHTML = `<div><b><i>${this.metadata[0].$menu.end}</i></b></div>`;
			nodes.push(node);
		}
		
		return nodes;
	}
	
	displayElements(id){				
		let children = this.translateDataChunkIntoNodes();
		let node = document.getElementById(id);
		for(let i=0;i<children.length;i++)
		    node.appendChild(children[i]);
	}
	
    repaint(id){
		this.index = 0;
		document.getElementById(id).innerHTML="";
		this.displayElements(id);
	}

    
	/*separating a view instance from the class has a double advantage:
		1. less decoupling from view, not possessing any instance
		2. a controller can externally allow to display the same content on more view elements
	*/
	setDisplayElementsDynamically(bool,id2){
		let id = id2 + "-scroll-end-listener";
		let sentinel = document.getElementById(id);
		
		if(bool)
			if(!sentinel){
				sentinel = document.createElement("div");
				sentinel.id = id;
				sentinel.dataset["listener_scroll_end"] = "1";
				document.getElementById(id2).insertAdjacentElement("afterend",sentinel);

				let observer = new IntersectionObserver(entries =>{    //the listener fires when the sentinel is observed
					if(entries[0].isIntersecting)
						this.displayElements(id2);			
				},{threshold: 0.3});	
				
				observer.observe(sentinel);	
				
				this.observer = observer;
			}
            else{
				this.observer.observe(sentinel);
				document.getElementById(id2).insertAdjacentElement("afterend",sentinel);
			}
							
		else
			if(sentinel && sentinel.parentElement){
			    sentinel.parentElement.removeChild(sentinel);
				this.observer.unobserve(sentinel);
			}			
	}	
}